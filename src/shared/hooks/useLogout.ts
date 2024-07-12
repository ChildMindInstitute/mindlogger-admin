import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import { page } from 'resources';
import { ApiResponseCodes } from 'api';
import { useAppDispatch } from 'redux/store';
import { alerts, auth, workspaces } from 'redux/modules';
import { deleteAccessTokenApi, deleteRefreshTokenApi } from 'modules/Auth/api';
import { Mixpanel } from 'shared/utils/mixpanel';
import { FeatureFlags } from 'shared/utils/featureFlags';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userData = auth.useData();
  const { email } = userData?.user || {};
  const workspace = workspaces.useData();

  // TODO: rewrite to reset the global state data besides the data needed in LockForm (if
  // completing LockForm implementation still planned, now that auth soft-lock is present).
  return async ({ shouldSoftLock = false } = {}) => {
    try {
      await deleteAccessTokenApi();
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

      Mixpanel.track('Logout');
      Mixpanel.logout();
      await FeatureFlags.logout();

      navigate(page.login);
    }
  };
};
