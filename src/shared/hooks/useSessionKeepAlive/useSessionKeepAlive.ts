import { useEffect, useRef } from 'react';

import { auth } from 'redux/modules';
import { refreshTokens } from 'shared/api';
import { authStorage, getTokenExpiration } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { useLogout } from 'shared/hooks/useLogout';

import { startActivityTracking, stopActivityTracking } from './activityTracker';
import { getLastActivityAt } from './sessionStore';
import { subscribeSessionSync } from './sessionSync';
import { SessionMessage } from './sessionSync.types';
import { getSessionId } from './sessionSync.utils';
import { resolveSessionConfig } from './useSessionKeepAlive.utils';

export const useSessionKeepAlive = () => {
  const { featureFlags } = useFeatureFlags();
  const isAuthorized = auth.useAuthorized();
  const logout = useLogout();

  // Refreshed every render so the logout never closes over a stale email or workspace.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  const isEnabled = !!featureFlags.enableSessionKeepAlive && isAuthorized;
  // Set by the engine below, so tracking can re-arm the timers without owning them.
  const scheduleRef = useRef<(() => void) | null>(null);

  // Runs with the flag off too: a session outlives its tab now, and the boot check reads this
  // clock to decide whether one left behind may carry on.
  useEffect(() => {
    if (!isAuthorized) return;

    startActivityTracking(() => scheduleRef.current?.());

    return stopActivityTracking;
  }, [isAuthorized]);

  useEffect(() => {
    if (!isEnabled) return;

    const { idleTimeoutMs, refreshLeadMs } = resolveSessionConfig();
    let refreshTimer: ReturnType<typeof setTimeout>;
    let logoutTimer: ReturnType<typeof setTimeout>;
    let hasEnded = false;

    const endSession = () => {
      if (hasEnded) return;
      hasEnded = true;
      logoutRef.current({ shouldSoftLock: true });
    };

    const schedule = () => {
      if (hasEnded) return;
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);

      const idleDeadline = (getLastActivityAt() ?? Date.now()) + idleTimeoutMs;
      const msUntilLogout = idleDeadline - Date.now();
      if (msUntilLogout <= 0) return endSession();

      // Re-enters schedule rather than ending outright: the clock is shared, so another tab may
      // have pushed the deadline out while this one sat idle.
      logoutTimer = setTimeout(schedule, msUntilLogout);

      // Read at decision time: another tab or an earlier refresh may have replaced the token.
      const expiresAt = getTokenExpiration(authStorage.getAccessToken());
      if (expiresAt === null) return;

      // Capped so a token shorter-lived than the lead does not refresh on every tick.
      const lead = Math.min(refreshLeadMs, (expiresAt - Date.now()) / 2);
      refreshTimer = setTimeout(refresh, Math.max(expiresAt - lead - Date.now(), 0));
    };

    const refresh = async () => {
      try {
        await refreshTokens();
        schedule();
      } catch {
        endSession();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') schedule();
    };

    // Adopting a sibling's rotation keeps this tab from spending an already-replaced token.
    const handleSyncMessage = (message: SessionMessage) => {
      if (message.type !== 'TOKENS_UPDATED') return;

      const { sessionId, accessToken, refreshToken } = message.payload;
      if (sessionId !== getSessionId()) return;

      authStorage.setAccessToken(accessToken);
      authStorage.setRefreshToken(refreshToken);
      schedule();
    };

    const unsubscribe = subscribeSessionSync(handleSyncMessage);
    scheduleRef.current = schedule;
    document.addEventListener('visibilitychange', handleVisibilityChange);
    schedule();

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);
      scheduleRef.current = null;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [isEnabled]);
};
