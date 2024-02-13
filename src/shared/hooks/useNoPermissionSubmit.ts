import { useNavigate } from 'react-router-dom';

import { alerts, applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';

export const useNoPermissionSubmit = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return () => {
    dispatch(applet.actions.resetApplet());
    dispatch(alerts.actions.resetAlerts());
    dispatch(alerts.thunk.getAlerts({ limit: DEFAULT_ROWS_PER_PAGE }));
    navigate(page.dashboardApplets);
  };
};
