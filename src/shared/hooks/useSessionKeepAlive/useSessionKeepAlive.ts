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
import { getLastActivityAt, setLastActivityAt } from './sessionStore';
import { publishSessionMessage, subscribeSessionSync } from './sessionSync';
import { SESSION_REQUEST_WINDOW_MS } from './sessionSync.const';
import { LogoutReason, SessionMessage } from './sessionSync.types';
import { getSessionId } from './sessionSync.utils';
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
    let hasEnded = false;

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

    const schedule = () => {
      if (hasEnded) return;
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);

      const idleDeadline = (getLastActivityAt() ?? Date.now()) + idleTimeoutMs;
      const msUntilLogout = idleDeadline - Date.now();
      if (msUntilLogout <= 0) return endSession('idle');

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
      const msLeft = (getLastActivityAt() ?? Date.now()) + idleTimeoutMs - Date.now();
      if (msLeft <= 0) return endSession('idle');

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

      // Ask first and give the answer a beat: a token gone stale during sleep would otherwise
      // refresh at zero delay, losing the race against a sibling handing over fresher ones.
      publishSessionMessage({ type: 'SESSION_REQUEST' });
      clearTimeout(catchUpTimer);
      catchUpTimer = setTimeout(schedule, SESSION_REQUEST_WINDOW_MS);
    };

    // Only tabs with a live session speak, which is what keeps a logged-out one silent.
    const announceSession = () => {
      const sessionId = getSessionId();
      const accessToken = authStorage.getAccessToken();
      const refreshToken = authStorage.getRefreshToken();
      if (!sessionId || !accessToken || !refreshToken) return;

      publishSessionMessage({
        type: 'SESSION_STATE',
        payload: { sessionId, accessToken, refreshToken },
      });
    };

    const handleSyncMessage = (message: SessionMessage) => {
      if (message.type === 'SESSION_REQUEST') return announceSession();

      // A sibling's answer may carry tokens that replaced this tab's while it slept. Every
      // rotation mints a later expiry, so the further-off one is the newer generation.
      if (message.type === 'SESSION_STATE') {
        const { sessionId, accessToken, refreshToken } = message.payload;
        if (sessionId !== getSessionId()) return;

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
