import { lazy } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Route } from 'react-router-dom';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';
import { ErrorFallback } from 'shared/components';

import { appletRoutes, mainRoutes } from './routes.const';

const Main = lazy(() => import('../pages/Main'));
const Applet = lazy(() => import('../pages/Applet'));
const RespondentData = lazy(() => import('../pages/RespondentData'));
const RespondentDataReview = lazy(() => import('../features/RespondentData/RespondentDataReview'));
const RespondentDataSummary = lazy(() => import('../features/RespondentData/RespondentDataSummary'));

export const dashboardRoutes = () => (
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
            <Applet />
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
        <Route path={page.appletRespondentData} element={<Navigate to={page.appletRespondentDataSummary} />} />
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
