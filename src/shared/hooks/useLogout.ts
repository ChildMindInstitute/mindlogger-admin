import { useNavigate } from 'react-router-dom';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { applets, auth, workspaces } from 'redux/modules';
import { clearLocalStorageExceptSetupKeys } from 'shared/utils';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //TODO: rewrite to reset the global state data besides the data needed in lock form
  return () => {
    clearLocalStorageExceptSetupKeys();
    dispatch(workspaces.actions.setCurrentWorkspace(null));
    dispatch(applets.actions.resetAppletsData());
    dispatch(auth.actions.resetAuthorization());
    navigate(page.login);
  };
};
