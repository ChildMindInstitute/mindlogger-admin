import { useEffect, useRef } from 'react';

import { auth } from 'redux/modules';
import { refreshTokens } from 'shared/api';
import { authStorage, getTokenExpiration } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { useLogout } from 'shared/hooks/useLogout';

import { getLastActivityAt, startActivityTracking, stopActivityTracking } from './activityTracker';
import { subscribeSessionSync } from './sessionSync';
import { SessionMessage } from './sessionSync.types';
import { getSessionId, stampRotatedAt } from './sessionSync.utils';
import { resolveSessionConfig } from './useSessionKeepAlive.utils';

export const useSessionKeepAlive = () => {
  const { featureFlags } = useFeatureFlags();
  const isAuthorized = auth.useAuthorized();
  const logout = useLogout();

  // Refreshed every render so the logout never closes over a stale email or workspace.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  const isEnabled = !!featureFlags.enableSessionKeepAlive && isAuthorized;

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

      logoutTimer = setTimeout(endSession, msUntilLogout);

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
      stampRotatedAt();
      schedule();
    };

    const unsubscribe = subscribeSessionSync(handleSyncMessage);
    startActivityTracking(schedule);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    schedule();

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);
      stopActivityTracking();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [isEnabled]);
};
