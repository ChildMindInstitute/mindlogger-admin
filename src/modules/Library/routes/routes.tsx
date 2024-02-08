import { ErrorBoundary } from 'react-error-boundary';
import { Route } from 'react-router-dom';

import { page } from 'resources';
import { ErrorFallback } from 'shared/components';

import { routes } from './routes.const';

export const libraryRoutes = () => (
  <Route path={page.library}>
    {routes.map(({ path, Component }) => (
      <Route
        key={path}
        path={path}
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Component />
          </ErrorBoundary>
        }
      />
    ))}
  </Route>
);
