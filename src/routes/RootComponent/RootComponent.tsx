import CssBaseline from '@mui/material/CssBaseline';
import { Suspense, useEffect } from 'react';

import { useAppDispatch } from 'redux/store';
import { auth } from 'modules/Auth';
import { useAlertsWebsocket } from 'shared/hooks';
import { alerts } from 'shared/state';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/state/Alerts/Alerts.const';
import { Spinner } from 'shared/components';
import { AppRoutes } from 'routes/index';

export const RootComponent = () => {
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();

  useAlertsWebsocket();

  useEffect(() => {
    if (!isAuthorized) return;

    dispatch(alerts.thunk.getAlerts({ limit: DEFAULT_ROWS_PER_PAGE }));
  }, [isAuthorized]);

  return (
    <>
      <CssBaseline />
      <Suspense fallback={<Spinner />}>
        <AppRoutes />
      </Suspense>
    </>
  );
};
