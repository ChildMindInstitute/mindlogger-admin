import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { store } from 'redux/store';
import theme from 'shared/styles/theme';
import { AppRoutes } from 'routes';
import { Spinner } from 'shared/components';

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<Spinner />}>
        <AppRoutes />
      </Suspense>
    </ThemeProvider>
  </Provider>
);

export default App;
