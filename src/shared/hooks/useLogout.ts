import { useNavigate } from 'react-router-dom';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, workspaces } from 'redux/modules';
import { logOutApi } from 'modules/Auth';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //TODO: rewrite to reset the global state data besides the data needed in lock form
  return async () => {
    await logOutApi();
    dispatch(workspaces.actions.setCurrentWorkspace(null));
    dispatch(auth.actions.resetAuthorization());
    navigate(page.login);
  };
};
