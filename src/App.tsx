import { Suspense, useEffect } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';

import { setupStore } from 'redux/store';
import { AppRoutes } from 'routes';
import { Spinner } from 'shared/components';
import { ErrorFallback } from 'shared/components/ErrorFallback';
import { theme } from 'shared/styles';
import svgBuilder from 'shared/utils/svgBuilder';

const App = () => {
  useEffect(() => {
    (async () => {
      const svgSprite = await import('svgSprite');
      document.body.appendChild(svgBuilder(svgSprite.default));
    })();
  }, []);

  return (
    <Provider store={setupStore()}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Spinner />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes />
          </ErrorBoundary>
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
