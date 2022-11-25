import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { store } from 'redux/store';
import theme from 'styles/theme';
import { AppRoutes } from 'routes/AppRoutes';
import { Spinner } from 'components/Spinner';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Spinner />}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
