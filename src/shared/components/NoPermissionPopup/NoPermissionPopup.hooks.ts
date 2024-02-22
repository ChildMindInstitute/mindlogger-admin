import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { alerts, applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { forbiddenState } from 'shared/state/ForbiddenState';
import {
  checkIfAppletUrlPassed,
  checkIfDashboardAppletsUrlPassed,
} from 'shared/utils/urlGenerator';

export const useNoPermissionPopup = () => {
  const [noAccessVisible, setNoAccessVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasForbiddenError = forbiddenState.useData()?.hasForbiddenError ?? {};
  const { pathname } = useLocation();
  const isDashboardApplets = checkIfDashboardAppletsUrlPassed(pathname);
  const isBuilder = checkIfAppletUrlPassed(pathname);

  const handleSubmit = () => {
    dispatch(forbiddenState.actions.clearForbiddenError());
    setNoAccessVisible(false);
    dispatch(applet.actions.resetApplet());
    dispatch(alerts.actions.resetAlerts());
    dispatch(alerts.thunk.getAlerts({ limit: DEFAULT_ROWS_PER_PAGE }));

    if (isDashboardApplets) {
      window.location.reload();

      return;
    }

    navigate(page.dashboardApplets);
  };

  useEffect(() => {
    if (!hasForbiddenError) return;

    setNoAccessVisible(true);
  }, [hasForbiddenError]);

  return {
    noAccessVisible,
    handleSubmit,
    isBuilder,
  };
};
