import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';
import { ErrorFallback } from 'shared/components';
import { FeatureFlags } from 'shared/types/featureFlags';

import {
  appletRoutes,
  mainRoutes,
  participantDetailsRoutes,
  participantActivityDetailsRoutes,
} from './routes.const';
import { AppletMultiInformant } from '../pages/Applet/AppletMultiInformant';

const Main = lazy(() => import('../pages/Main'));
const Applet = lazy(() => import('../pages/Applet'));
const ParticipantDetails = lazy(() => import('../pages/ParticipantDetails'));
const ParticipantActivity = lazy(() => import('../features/ParticipantActivity'));

export const dashboardRoutes = (featureFlags: FeatureFlags) => (
  <Route path={page.dashboard}>
    <Route element={<Main />}>
      <Route index element={<Navigate to={page.dashboardApplets} replace />} />
      {mainRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Component />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
      ))}
    </Route>
    <Route
      element={
        <PrivateRoute>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {featureFlags.enableMultiInformant ? <AppletMultiInformant /> : <Applet />}
          </ErrorBoundary>
        </PrivateRoute>
      }
    >
      {appletRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Component />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
      ))}
    </Route>
    <Route
      element={
        <PrivateRoute>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ParticipantDetails />
          </ErrorBoundary>
        </PrivateRoute>
      }
    >
      {participantDetailsRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Component />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
      ))}
    </Route>
    <Route
      element={
        <PrivateRoute>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ParticipantActivity />
          </ErrorBoundary>
        </PrivateRoute>
      }
    >
      {participantActivityDetailsRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Component />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
      ))}
    </Route>
  </Route>
);
