import { useCallback, useEffect, useRef, useState } from 'react';

import { auth } from 'redux/modules';
import { refreshTokens } from 'shared/api';
import { authStorage, getTokenExpiration } from 'shared/utils';
import { useLogout } from 'shared/hooks/useLogout';

import {
  setActivityTrackingPaused,
  startActivityTracking,
  stopActivityTracking,
} from './activityTracker';
import { getLastActivityAt, setActiveSessionId, setLastActivityAt } from './sessionStore';
import { isSessionRevoked, publishSessionMessage, subscribeSessionSync } from './sessionSync';
import { SESSION_REQUEST_WINDOW_MS } from './sessionSync.const';
import { LogoutReason, SessionMessage } from './sessionSync.types';
import { leaveEndedSession } from './leaveEndedSession';
import { getSessionId, ownsActiveSession } from './sessionSync.utils';
import { COUNTDOWN_TICK_MS } from './useSessionKeepAlive.const';
import { resolveSessionConfig } from './useSessionKeepAlive.utils';

export const useSessionKeepAlive = () => {
  const isAuthorized = auth.useAuthorized();
  const logout = useLogout();

  // Refreshed every render so the logout never closes over a stale email or workspace.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  // Set by the engine below, so tracking can re-arm the timers without owning them.
  const scheduleRef = useRef<(() => void) | null>(null);

  // Reached by the warning's buttons, which answer the countdown without owning the timers.
  const extendRef = useRef<(() => void) | null>(null);
  const endRef = useRef<((reason: LogoutReason) => void) | null>(null);

  // Milliseconds left to answer in, or null while the deadline is still far off.
  const [msRemaining, setMsRemaining] = useState<number | null>(null);
  const isWarningOpen = msRemaining !== null;

  // Kept apart from the engine: the boot check reads this clock, so it outlives any teardown.
  useEffect(() => {
    if (!isAuthorized) return;

    startActivityTracking(() => scheduleRef.current?.());

    return stopActivityTracking;
  }, [isAuthorized]);

  // The warning is answered, not waved away: while it is open, reaching for the mouse must not
  // push the deadline out on its own. stopActivityTracking clears this on teardown.
  useEffect(() => {
    setActivityTrackingPaused(isWarningOpen);
  }, [isWarningOpen]);

  useEffect(() => {
    if (!isAuthorized) return;

    const { idleTimeoutMs, refreshLeadMs, warningLeadMs } = resolveSessionConfig();
    let refreshTimer: ReturnType<typeof setTimeout>;
    let logoutTimer: ReturnType<typeof setTimeout>;
    let warningTimer: ReturnType<typeof setTimeout>;
    let catchUpTimer: ReturnType<typeof setTimeout>;
    let confirmTimer: ReturnType<typeof setTimeout>;
    let hasEnded = false;
    let isConfirming = false;

    // Soft lock only for logouts nobody asked for, so a deliberate one is not undone on return.
    const endSession = (reason: LogoutReason, isRemote = false) => {
      if (hasEnded) return;
      hasEnded = true;
      setMsRemaining(null);
      logoutRef.current({ shouldSoftLock: reason !== 'manual', reason, isRemote });
    };

    // Armed once per token rather than on every pass: the cap below measures what is left right
    // now, so re-deriving it as the token ages walks the refresh ever closer to expiry.
    let refreshArmedFor: number | null = null;

    const scheduleRefresh = () => {
      // Read at decision time: another tab or an earlier refresh may have replaced the token.
      const expiresAt = getTokenExpiration(authStorage.getAccessToken());
      if (expiresAt === null || expiresAt === refreshArmedFor) return;

      refreshArmedFor = expiresAt;
      clearTimeout(refreshTimer);
      // Capped so a token shorter-lived than the lead does not refresh the moment it arrives.
      const lead = Math.min(refreshLeadMs, (expiresAt - Date.now()) / 2);
      refreshTimer = setTimeout(refresh, Math.max(expiresAt - lead - Date.now(), 0));
    };

    // A background tab's timers can fire before its focus check, after another session has taken the
    // browser. Acting on that session's clock or tokens would keep this tab alive or put the old
    // session back over theirs, so it leaves for the login page instead.
    const hasLostBrowser = () => {
      if (ownsActiveSession()) return false;

      hasEnded = true;
      leaveEndedSession();

      return true;
    };

    // The deadline is put to the siblings before it is acted on. A tab woken from a freeze reads the
    // clock its process last saw, which is the deadline it was heading for when it went under, not
    // the one a sibling has since pushed out. A live sibling answers with its own reading; nobody
    // answering means there is no one left to contradict this tab.
    const confirmIdleEnd = () => {
      if (hasEnded || isConfirming) return;
      isConfirming = true;

      publishSessionMessage({ type: 'SESSION_REQUEST' });

      clearTimeout(confirmTimer);
      confirmTimer = setTimeout(() => {
        isConfirming = false;

        const lastActivityAt = getLastActivityAt();
        if (!lastActivityAt) return endSession('idle', true);
        // An answer landed and moved the deadline out, so the session is still someone's.
        if (lastActivityAt + idleTimeoutMs > Date.now()) return schedule();

        endSession('idle');
      }, SESSION_REQUEST_WINDOW_MS);
    };

    const schedule = () => {
      if (hasEnded) return;
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);

      const lastActivityAt = getLastActivityAt();
      // Tracking seeds the clock before this first runs, so gone means another tab ended the session.
      if (!lastActivityAt) return endSession('idle', true);
      if (hasLostBrowser()) return;

      const msUntilLogout = lastActivityAt + idleTimeoutMs - Date.now();
      if (msUntilLogout <= 0) return confirmIdleEnd();

      // The last stretch belongs to the countdown, not to another pass through here, which would
      // tear down and re-arm every timer once a second for nothing.
      if (msUntilLogout <= warningLeadMs) {
        setMsRemaining(msUntilLogout);
        warningTimer = setTimeout(tick, COUNTDOWN_TICK_MS);
      } else {
        setMsRemaining(null);
        warningTimer = setTimeout(tick, msUntilLogout - warningLeadMs);
      }

      // Re-enters schedule rather than ending outright: the clock is shared, so another tab may
      // have pushed the deadline out while this one sat idle.
      logoutTimer = setTimeout(schedule, msUntilLogout);

      scheduleRefresh();
    };

    // Redraws the countdown off the shared clock, which is how a sibling answering the warning
    // closes this tab's copy of it too.
    const tick = () => {
      const lastActivityAt = getLastActivityAt();
      if (!lastActivityAt) return endSession('idle', true);
      if (hasLostBrowser()) return;

      const msLeft = lastActivityAt + idleTimeoutMs - Date.now();
      if (msLeft <= 0) return confirmIdleEnd();

      // The deadline moved out from under us, so hand back to the scheduler and stop counting.
      if (msLeft > warningLeadMs) return schedule();

      setMsRemaining(msLeft);
      warningTimer = setTimeout(tick, COUNTDOWN_TICK_MS);
    };

    // Answering counts as activity, so siblings showing the same warning close it on their next tick.
    const extendSession = () => {
      if (hasEnded) return;

      setLastActivityAt(Date.now());
      schedule();
    };

    const refresh = async () => {
      if (hasEnded || hasLostBrowser()) return;

      try {
        await refreshTokens();
        // Always re-arms, even if the replacement happens to carry the same expiry.
        refreshArmedFor = null;
        schedule();
      } catch {
        endSession('refresh-failed');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      // Tracking keeps this clock while the tab is signed in, and only a teardown removes it. Gone
      // means the session ended somewhere a frozen tab could not hear, and no message is coming.
      if (!getLastActivityAt()) return endSession('idle', true);

      // A session that began while this tab slept owns the browser now, so this one is over. It
      // cannot tear down or adopt its way across: everything it holds, storage snapshot included,
      // belongs to the old user. It leaves for the login page, where the banner offers the way in.
      if (!ownsActiveSession()) return leaveEndedSession();

      // Ask first and give the answer a beat: a token gone stale during sleep would otherwise
      // refresh at zero delay, losing the race against a sibling handing over fresher ones.
      publishSessionMessage({ type: 'SESSION_REQUEST' });
      clearTimeout(catchUpTimer);
      catchUpTimer = setTimeout(schedule, SESSION_REQUEST_WINDOW_MS);
    };

    // Only tabs with a live session speak, which is what keeps a logged-out one silent. Holding the
    // tokens is not enough: a tab still waiting on its own revoke call holds them too.
    const announceSession = () => {
      if (hasEnded) return;

      // A background tab's timers can run late, so the clock is checked before vouching for it.
      const lastActivityAt = getLastActivityAt();
      if (!lastActivityAt) return endSession('idle', true);
      if (hasLostBrowser()) return;
      if (Date.now() - lastActivityAt >= idleTimeoutMs) return endSession('idle');

      const sessionId = getSessionId();
      const accessToken = authStorage.getAccessToken();
      const refreshToken = authStorage.getRefreshToken();
      if (!sessionId || isSessionRevoked(sessionId) || !accessToken || !refreshToken) return;

      publishSessionMessage({
        type: 'SESSION_STATE',
        payload: { sessionId, lastActivityAt, accessToken, refreshToken },
      });
    };

    const handleSyncMessage = (message: SessionMessage) => {
      if (message.type === 'SESSION_REQUEST') return announceSession();

      // A sibling's answer may carry tokens that replaced this tab's while it slept. Every
      // rotation mints a later expiry, so the further-off one is the newer generation.
      if (message.type === 'SESSION_STATE') {
        const { sessionId, accessToken, refreshToken, lastActivityAt } = message.payload;
        if (sessionId !== getSessionId()) return;

        // Answering "Stay logged in" is only written to the shared clock, so a tab that slept
        // through it can wake reading the deadline it was heading for. The sibling still in use
        // holds the later reading, and taking it is what keeps this tab from ending a live session.
        if (lastActivityAt > (getLastActivityAt() ?? 0)) {
          setLastActivityAt(lastActivityAt);
          schedule();
        }

        const offered = getTokenExpiration(accessToken);
        const held = getTokenExpiration(authStorage.getAccessToken());
        if (offered === null || (held !== null && offered <= held)) return;

        authStorage.setAccessToken(accessToken);
        authStorage.setRefreshToken(refreshToken);
        schedule();

        return;
      }

      // A sibling ended the session for all of us, so tear down without revoking it again.
      if (message.type === 'LOGOUT') {
        if (message.payload.sessionId !== getSessionId()) return;

        endSession(message.payload.reason, true);

        return;
      }

      // Adopting a sibling's rotation keeps this tab from spending an already-replaced token.
      if (message.type !== 'TOKENS_UPDATED') return;

      const { sessionId, accessToken, refreshToken } = message.payload;
      if (sessionId !== getSessionId()) return;

      authStorage.setAccessToken(accessToken);
      authStorage.setRefreshToken(refreshToken);
      schedule();
    };

    // Claimed once, here: a tab woken from a freeze never remounts, so it can never overwrite the
    // id of a session that started while it slept. That is what lets it recognise it is stale.
    const ownSessionId = getSessionId();
    if (ownSessionId) setActiveSessionId(ownSessionId);

    const unsubscribe = subscribeSessionSync(handleSyncMessage);
    scheduleRef.current = schedule;
    extendRef.current = extendSession;
    endRef.current = endSession;
    document.addEventListener('visibilitychange', handleVisibilityChange);
    schedule();
    // A tab frozen past a rotation falls back in step the moment it starts, not at its next refresh.
    publishSessionMessage({ type: 'SESSION_REQUEST' });
    // Unprompted, because a tab still on the login page has no session to ask with. This is how
    // it hears that one just began.
    announceSession();

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      clearTimeout(catchUpTimer);
      clearTimeout(confirmTimer);
      setMsRemaining(null);
      scheduleRef.current = null;
      extendRef.current = null;
      endRef.current = null;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [isAuthorized]);

  const stayLoggedIn = useCallback(() => extendRef.current?.(), []);
  const logOutNow = useCallback(() => endRef.current?.('manual'), []);

  return { msRemaining, stayLoggedIn, logOutNow };
};
