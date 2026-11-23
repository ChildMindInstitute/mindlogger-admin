import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { page } from 'resources';
import { ErrorFallback } from 'shared/components';

import { routes } from './routes.const';

const Lock = lazy(() => import('../pages/Lock'));
const AcceptMsa = lazy(() => import('../pages/AcceptMsa'));

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

// Rendered outside AuthLayout: the MSA page has its own plain background
export const acceptMsaRoute = () => (
  <Route
    key={page.acceptMsa}
    path={page.acceptMsa}
    element={
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AcceptMsa />
      </ErrorBoundary>
    }
  />
);
