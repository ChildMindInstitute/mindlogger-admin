import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { alerts, applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { LocationStateKeys } from 'shared/types';
import { useCheckIfAppletHasNotFoundError } from 'shared/hooks/useCheckIfAppletHasNotFoundError';

export const useNotFoundPopup = () => {
  const [appletNotFoundPopupVisible, setAppletNotFoundPopupVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const hasNotFoundError = useCheckIfAppletHasNotFoundError();

  const handleClose = () => {
    setAppletNotFoundPopupVisible(false);
  };
  const handleSubmit = () => {
    setAppletNotFoundPopupVisible(false);
    dispatch(applet.actions.resetApplet());
    dispatch(alerts.actions.resetAlerts());
    dispatch(alerts.thunk.getAlerts({ limit: DEFAULT_ROWS_PER_PAGE }));
    navigate(page.dashboardApplets, {
      state: { ...location.state, [LocationStateKeys.ShouldNavigateWithoutPrompt]: true },
    });
  };

  useEffect(() => {
    if (!hasNotFoundError) return;
    setAppletNotFoundPopupVisible(true);
  }, [hasNotFoundError]);

  return {
    appletNotFoundPopupVisible,
    handleClose,
    handleSubmit,
  };
};
