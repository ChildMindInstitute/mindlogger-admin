import { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { store, useAppDispatch } from 'redux/store';
import theme from 'shared/styles/theme';
import { AppRoutes } from 'routes';
import { Spinner } from 'shared/components';
import { useWebsocket } from 'shared/hooks';
import { alerts } from 'shared/state';
import { auth } from 'modules/Auth';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/state/Alerts/Alerts.const';

const RootComponent = () => {
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();

  useWebsocket();

  useEffect(() => {
    if (!isAuthorized) return;

    const { getAlerts } = alerts.thunk;
    dispatch(getAlerts({ limit: DEFAULT_ROWS_PER_PAGE }));
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

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <RootComponent />
    </ThemeProvider>
  </Provider>
);

export default App;
