import { useEffect, useRef } from 'react';

import { auth } from 'redux/modules';
import { refreshTokens } from 'shared/api';
import { authStorage, getTokenExpiration } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { useLogout } from 'shared/hooks/useLogout';

import {
  adoptActivityAt,
  getLastActivityAt,
  startActivityTracking,
  stopActivityTracking,
} from './activityTracker';
import { publishSessionMessage, subscribeSessionSync } from './sessionSync';
import { LogoutReason, SessionMessage } from './sessionSync.types';
import { getLoginAt, getRotatedAt, getSessionId, stampRotatedAt } from './sessionSync.utils';
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

    // Soft lock only for logouts nobody asked for, so a deliberate one is not undone on return.
    const endSession = (reason: LogoutReason, isRemote = false) => {
      if (hasEnded) return;
      hasEnded = true;
      logoutRef.current({ shouldSoftLock: reason !== 'manual', reason, isRemote });
    };

    const schedule = () => {
      if (hasEnded) return;
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);

      const idleDeadline = (getLastActivityAt() ?? Date.now()) + idleTimeoutMs;
      const msUntilLogout = idleDeadline - Date.now();
      if (msUntilLogout <= 0) return endSession('idle');

      logoutTimer = setTimeout(() => endSession('idle'), msUntilLogout);

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
        endSession('refresh-failed');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') schedule();
    };

    const handleSyncMessage = (message: SessionMessage) => {
      // Only tabs with a live session answer, which is what keeps a logged-out one silent.
      if (message.type === 'SESSION_REQUEST') {
        const sessionId = getSessionId();
        if (!sessionId) return;

        publishSessionMessage({
          type: 'SESSION_STATE',
          payload: {
            sessionId,
            loginAt: getLoginAt(),
            rotatedAt: getRotatedAt(),
            accessToken: authStorage.getAccessToken(),
            refreshToken: authStorage.getRefreshToken(),
          },
        });

        return;
      }

      // A sibling ended the session for all of us, so tear down without revoking it again.
      if (message.type === 'LOGOUT') {
        if (message.payload.sessionId !== getSessionId()) return;

        endSession(message.payload.reason, true);

        return;
      }

      // Someone working in any tab of this session keeps every other tab from idling out.
      if (message.type === 'ACTIVITY') {
        if (message.payload.sessionId !== getSessionId()) return;

        adoptActivityAt(message.payload.lastActivityAt);
        schedule();

        return;
      }

      // Adopting a sibling's rotation keeps this tab from spending an already-replaced token.
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
