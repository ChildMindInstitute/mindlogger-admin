import { useLocation, useNavigate } from 'react-router-dom';

import { alerts, applet, workspaces } from 'shared/state';
import { popups } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { LocationStateKeys } from 'shared/types';
import { forbiddenState } from 'shared/state/ForbiddenState';
import { Workspace, auth } from 'redux/modules';
import {
  checkIfAppletUrlPassed,
  checkIfDashboardAppletsUrlPassed,
} from 'shared/utils/urlGenerator';

import { UseNoPermissionPopupReturn } from './NoPermissionPopup.types';

export const useNoPermissionPopup = (): UseNoPermissionPopupReturn => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasForbiddenError = forbiddenState.useData()?.hasForbiddenError ?? {};
  const { pathname } = useLocation();
  const isDashboardApplets = checkIfDashboardAppletsUrlPassed(pathname);
  const isBuilder = checkIfAppletUrlPassed(pathname);
  const userData = auth.useData();
  const { id } = userData?.user || {};

  const handleSubmit = async () => {
    dispatch(forbiddenState.actions.clearForbiddenError());
    isBuilder && dispatch(forbiddenState.actions.setRedirectedFromBuilder());
    dispatch(applet.actions.resetApplet());
    dispatch(alerts.actions.resetAlerts());
    dispatch(alerts.thunk.getAlerts({ limit: DEFAULT_ROWS_PER_PAGE }));
    dispatch(popups.actions.resetPopupsVisibility());
    const { getWorkspaces } = workspaces.thunk;
    const result = await dispatch(getWorkspaces());

    if (getWorkspaces.fulfilled.match(result)) {
      const workspacesData = result.payload.data.result as Workspace[];
      const workspace = workspacesData.find((item) => item.ownerId === id);
      dispatch(workspaces.actions.setCurrentWorkspace(workspace ?? null));

      Promise.resolve(
        navigate(page.dashboardApplets, { state: { [LocationStateKeys.Workspace]: workspace } }),
      ).then(() => {
        isBuilder && dispatch(forbiddenState.actions.resetRedirectedFromBuilder());
      });

      return;
    }

    if (isDashboardApplets) {
      window.location.reload();

      return;
    }

    navigate(page.dashboardApplets);
  };

  return {
    noAccessVisible: hasForbiddenError,
    handleSubmit,
    isBuilder,
  };
};
