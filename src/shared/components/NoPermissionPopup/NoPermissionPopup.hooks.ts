import { useLocation, useNavigate } from 'react-router-dom';

import { alerts, applet } from 'shared/state';
import { popups } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { forbiddenState } from 'shared/state/ForbiddenState';
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

  const handleSubmit = () => {
    dispatch(forbiddenState.actions.clearForbiddenError());
    dispatch(applet.actions.resetApplet());
    dispatch(alerts.actions.resetAlerts());
    dispatch(alerts.thunk.getAlerts({ limit: DEFAULT_ROWS_PER_PAGE }));
    dispatch(popups.actions.resetPopupsVisibility());

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
