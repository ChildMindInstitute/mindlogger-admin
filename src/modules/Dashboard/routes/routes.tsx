import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';
import { WithPermissions } from 'shared/HOCs';
import { Roles } from 'shared/consts';

import { mainRoutes, appletRoutes } from './routes.const';
import { RespondentDataReview, RespondentDataSummary } from '../features';

const Main = lazy(() => import('../pages/Main'));
const Applet = lazy(() => import('../pages/Applet'));
const RespondentData = lazy(() => import('../pages/RespondentData'));

export const dashboardRoutes = () => (
  <Route path={page.dashboard}>
    <Route element={<Main />}>
      <Route index element={<Navigate to={page.dashboardApplets} replace />} />
      {mainRoutes.map(({ path, Component, forbiddenRoles }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <WithPermissions forbiddenRoles={forbiddenRoles}>
                <Component />
              </WithPermissions>
            </PrivateRoute>
          }
        />
      ))}
    </Route>
    <Route
      element={
        <WithPermissions forbiddenRoles={[Roles.Editor, Roles.Respondent]}>
          <Applet />
        </WithPermissions>
      }
    >
      {appletRoutes.map(({ path, Component, forbiddenRoles }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <WithPermissions forbiddenRoles={forbiddenRoles}>
                <Component />
              </WithPermissions>
            </PrivateRoute>
          }
        />
      ))}
      <Route
        element={
          <WithPermissions forbiddenRoles={[Roles.Coordinator]}>
            <RespondentData />
          </WithPermissions>
        }
      >
        <Route
          path={page.appletRespondentData}
          element={<Navigate to={page.appletRespondentDataSummary} />}
        />
        <Route
          path={page.appletRespondentDataSummary}
          element={
            <PrivateRoute>
              <RespondentDataSummary />
            </PrivateRoute>
          }
        />
        <Route path={page.appletRespondentDataReview} element={<RespondentDataReview />}>
          <Route
            path={page.appletRespondentDataReviewAnswer}
            element={
              <PrivateRoute>
                <RespondentDataReview />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
    </Route>
  </Route>
);
