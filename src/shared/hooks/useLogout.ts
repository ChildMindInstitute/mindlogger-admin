import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { datadogRum } from '@datadog/browser-rum';

import { page } from 'resources';
import { ApiResponseCodes } from 'api';
import { useAppDispatch } from 'redux/store';
import { alerts, auth, workspaces } from 'redux/modules';
import { deleteAccessTokenApi, deleteRefreshTokenApi } from 'modules/Auth/api';
import { Mixpanel, MixpanelEventType } from 'shared/utils/mixpanel';
import { FeatureFlags } from 'shared/utils/featureFlags';
import { dbg } from 'shared/utils/sessionDebugLog';
import {
  markSessionRevoked,
  publishSessionMessage,
} from 'shared/hooks/useSessionKeepAlive/sessionSync';
import { stopActivityTracking } from 'shared/hooks/useSessionKeepAlive/activityTracker';
import { leaveEndedSession } from 'shared/hooks/useSessionKeepAlive/leaveEndedSession';
import { LogoutReason } from 'shared/hooks/useSessionKeepAlive/sessionSync.types';
import {
  getSessionId,
  ownsActiveSession,
} from 'shared/hooks/useSessionKeepAlive/sessionSync.utils';
import { LocationStateKeys } from 'shared/types/navigation';

type LogoutOptions = {
  shouldSoftLock?: boolean;
  reason?: LogoutReason;
  isRemote?: boolean;
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userData = auth.useData();
  const { email } = userData?.user || {};
  const workspace = workspaces.useData();

  // TODO: rewrite to reset the global state data besides the data needed in LockForm (if
  // completing LockForm implementation still planned, now that auth soft-lock is present).
  return async ({
    shouldSoftLock = false,
    reason = 'manual',
    isRemote = false,
  }: LogoutOptions = {}) => {
    dbg('logout', { reason, isRemote, owns: ownsActiveSession() });

    // Every teardown funnels through here, so this is the one place that has to refuse. A tab that
    // slept through a logout and someone else signing in would clear a store that is theirs now,
    // signing them out of every tab. It leaves for the login page instead.
    if (!ownsActiveSession()) return leaveEndedSession();

    // The session is over from here, whoever ended it. Said before the teardown because this tab
    // holds its tokens until the revoke call comes back, and a sibling landing on the login page
    // asks for a session in exactly that gap — an answer would raise the banner over nothing.
    const sessionId = getSessionId();
    if (sessionId) markSessionRevoked(sessionId);

    // For the same reason: activity recorded now belongs to a dead session, and the clock is what
    // a sibling falls back on when nobody answers.
    stopActivityTracking();

    // Sent first: teardown clears the token the session id is read from, and siblings that hear
    // late spend the gap making requests the revoked session can only answer with a 401.
    if (sessionId && !isRemote) {
      publishSessionMessage({ type: 'LOGOUT', payload: { sessionId, reason } });
    }

    try {
      // A remote logout follows the tab that already revoked the family, so asking again only 401s.
      if (!isRemote) await deleteAccessTokenApi();
    } catch (e) {
      if ((e as AxiosError).response?.status === ApiResponseCodes.Unauthorized)
        await deleteRefreshTokenApi();
    } finally {
      if (shouldSoftLock) {
        dispatch(
          auth.actions.startSoftLock({
            email,
            redirectTo: window.location.pathname,
            workspace,
          }),
        );
      }
      dispatch(workspaces.actions.setCurrentWorkspace(null));
      dispatch(alerts.actions.resetAlerts());
      dispatch(auth.actions.resetAuthorization());

      datadogRum.clearUser();
      Mixpanel.track({ action: MixpanelEventType.Logout });
      Mixpanel.logout();
      await FeatureFlags.logout();

      // An idle logout never passes through startLogout, so the builder's unsaved-changes blocker
      // is still armed and would strand the user on a prompt this dead session cannot answer.
      navigate(page.login, { state: { [LocationStateKeys.ShouldNavigateWithoutPrompt]: true } });
    }
  };
};
