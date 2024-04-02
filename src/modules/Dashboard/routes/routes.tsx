import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';
import { ErrorFallback } from 'shared/components';
import { FeatureFlags } from 'shared/types/featureFlags';

import { appletRoutes, mainRoutes, participantDetailsRoutes } from './routes.const';
import { AppletMultiInformant } from '../pages/Applet/AppletMultiInformant';

const Main = lazy(() => import('../pages/Main'));
const Applet = lazy(() => import('../pages/Applet'));
const ParticipantDetails = lazy(() => import('../pages/ParticipantDetails'));
const ParticipantActivityDetails = lazy(() => import('../pages/ParticipantActivityDetails'));
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
            {flags.enableMultiInformant ? <AppletMultiInformant /> : <Applet />}
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
    <Route path={page.appletParticipantActivityDetails} element={<ParticipantActivityDetails />}>
      <Route
        path={page.appletParticipantActivityDetails}
        element={
          <PrivateRoute>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <ParticipantActivityDetails />
            </ErrorBoundary>
          </PrivateRoute>
        }
      />
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
  </Route>
);
