import { lazy } from 'react';
import {
  createSearchParams,
  Navigate,
  NavigateProps,
  Route,
  generatePath,
  useParams,
  URLSearchParamsInit,
} from 'react-router-dom';
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
const ParticipantDetails = lazy(() => import('../pages/ParticipantDetails'));
const RespondentData = lazy(() => import('../pages/RespondentData'));
const RespondentDataReview = lazy(() => import('../features/RespondentData/RespondentDataReview'));
const RespondentDataSummary = lazy(
  () => import('../features/RespondentData/RespondentDataSummary'),
);

const RedirectWithParams = ({
  to,
  searchParams = {},
  ...otherProps
}: NavigateProps & { searchParams?: URLSearchParamsInit }) => {
  const existingParams = useParams();
  const redirectWithParams = generatePath(to as string, { ...existingParams });
  const parsedSearchParams = createSearchParams(searchParams).toString();

  return (
    <Navigate
      to={`${redirectWithParams}${parsedSearchParams ? `?${parsedSearchParams}` : ''}`}
      {...otherProps}
    />
  );
};

export const dashboardRoutes = (_featureFlags: FeatureFlags) => (
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
            <AppletMultiInformant />
          </ErrorBoundary>
        </PrivateRoute>
      }
    >
      {appletRoutes.map(({ path, Component }) => {
        if (path === page.appletRespondents) {
          return (
            <Route
              key={path}
              path={path}
              element={<RedirectWithParams to={page.appletParticipants} replace />}
            />
          );
        }

        if (path === page.appletAddUser) {
          return (
            <Route
              key={path}
              path={path}
              element={
                <RedirectWithParams
                  to={page.appletParticipants}
                  replace
                  searchParams={{ showAddParticipant: 'true' }}
                />
              }
            />
          );
        }

        return (
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
        );
      })}
      <Route element={<RespondentData />}>
        <Route
          path={page.appletRespondentData}
          element={<Navigate to={page.appletParticipantDataSummary} />}
        />
        <Route path={page.appletParticipantDataSummary} element={<RespondentDataSummary />}>
          <Route
            path={page.appletParticipantDataSummary}
            element={
              <PrivateRoute>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <RespondentDataSummary />
                </ErrorBoundary>
              </PrivateRoute>
            }
          />
        </Route>
        <Route path={page.appletParticipantDataReview} element={<RespondentDataReview />}>
          <Route
            path={page.appletParticipantDataReview}
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
            <RespondentData />
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
