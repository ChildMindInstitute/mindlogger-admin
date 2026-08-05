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
import { publishSessionMessage } from 'shared/hooks/useSessionKeepAlive/sessionSync';
import { LogoutReason } from 'shared/hooks/useSessionKeepAlive/sessionSync.types';
import { getSessionId } from 'shared/hooks/useSessionKeepAlive/sessionSync.utils';

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
    // Sent first: teardown clears the token the session id is read from, and siblings that hear
    // late spend the gap making requests the revoked session can only answer with a 401.
    if (!isRemote) {
      const sessionId = getSessionId();
      if (sessionId) publishSessionMessage({ type: 'LOGOUT', payload: { sessionId, reason } });
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

      navigate(page.login);
    }
  };
};
