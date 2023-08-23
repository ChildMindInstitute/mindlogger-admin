import { useNavigate } from 'react-router-dom';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { alerts, auth, workspaces } from 'redux/modules';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //TODO: rewrite to reset the global state data besides the data needed in lock form
  return () => {
    dispatch(workspaces.actions.setCurrentWorkspace(null));
    dispatch(alerts.actions.resetAlerts());
    dispatch(auth.actions.resetAuthorization());
    navigate(page.login);
  };
};
