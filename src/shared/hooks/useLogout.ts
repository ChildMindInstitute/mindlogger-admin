import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import { page } from 'resources';
import { ApiResponseCodes } from 'api';
import { useAppDispatch } from 'redux/store';
import { alerts, auth, workspaces } from 'redux/modules';
import { logOut2Api, logOutApi } from 'modules/Auth';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //TODO: rewrite to reset the global state data besides the data needed in lock form
  return async () => {
    try {
      await logOutApi();
    } catch (e) {
      if ((e as AxiosError).response?.status === ApiResponseCodes.Unauthorized) await logOut2Api();
    } finally {
      dispatch(workspaces.actions.setCurrentWorkspace(null));
      dispatch(alerts.actions.resetAlerts());
      dispatch(auth.actions.resetAuthorization());
      navigate(page.login);
    }
  };
};
