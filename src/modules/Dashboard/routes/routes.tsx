import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';
import { ErrorFallback } from 'shared/components';
import { FeatureFlags } from 'shared/types/featureFlags';

import { appletRoutes, mainRoutes } from './routes.const';
import { AppletMultiInformant } from '../pages/Applet/AppletMultiInformant';

const Main = lazy(() => import('../pages/Main'));
const Applet = lazy(() => import('../pages/Applet'));
const RespondentData = lazy(() => import('../pages/RespondentData'));
const RespondentDataReview = lazy(() => import('../features/RespondentData/RespondentDataReview'));
const RespondentDataSummary = lazy(
  () => import('../features/RespondentData/RespondentDataSummary'),
);

export const dashboardRoutes = (flags: FeatureFlags) => (
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
            {flags.multiInformantFlag ? <AppletMultiInformant /> : <Applet />}
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
      <Route element={<RespondentData />}>
        <Route
          path={page.appletRespondentData}
          element={<Navigate to={page.appletRespondentDataSummary} />}
        />
        <Route path={page.appletRespondentDataSummary} element={<RespondentDataSummary />}>
          <Route
            path={page.appletRespondentDataSummary}
            element={
              <PrivateRoute>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <RespondentDataSummary />
                </ErrorBoundary>
              </PrivateRoute>
            }
          />
        </Route>
        <Route path={page.appletRespondentDataReview} element={<RespondentDataReview />}>
          <Route
            path={page.appletRespondentDataReview}
            element={
              <PrivateRoute>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <RespondentDataReview />
                </ErrorBoundary>
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
    </Route>
  </Route>
);
