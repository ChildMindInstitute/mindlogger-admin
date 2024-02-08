import { lazy } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { Route } from 'react-router-dom';

import { page } from 'resources';
import { ErrorFallback } from 'shared/components';

import { routes } from './routes.const';

const Lock = lazy(() => import('../pages/Lock'));

export const authRoutes = () => (
  <>
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
    <Route
      key={page.lock}
      path={page.lock}
      element={
        // TODO: supplement the condition
        <Lock />
      }
    />
  </>
);
