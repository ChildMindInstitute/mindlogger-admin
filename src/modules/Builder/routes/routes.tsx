import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';
import { Path } from 'shared/utils';
import BuilderAppletSettings from 'modules/Builder/features/BuilderAppletSettings';
import ActivitySettings from 'modules/Builder/features/ActivitySettings';

import {
  newAppletNewActivityFlowRoutes,
  newAppletRoutes,
  newAppletActivityRoutes,
} from './routes.const';

const BuilderApplet = lazy(() => import('../pages/BuilderApplet'));
const BuilderActivityFlow = lazy(() => import('../pages/BuilderActivityFlow'));
const BuilderActivity = lazy(() => import('../pages/BuilderActivity'));

export const builderRoutes = () => (
  <Route path={page.builder}>
    <Route element={<BuilderApplet />} path=":appletId">
      <Route index element={<Navigate to={Path.About} replace />} />
      {newAppletRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={<PrivateRoute>{Component ? <Component /> : <></>}</PrivateRoute>}
        />
      ))}
      <Route path={Path.Settings}>
        <Route element={<BuilderAppletSettings />} path="">
          <Route
            path=":settingItem"
            element={
              <PrivateRoute>
                <BuilderAppletSettings />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
      <Route path={Path.Activities}>
        <Route element={<BuilderActivity />} path=":activityId">
          <Route index element={<Navigate to={Path.About} replace />} />
          {newAppletActivityRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{Component ? <Component /> : <></>}</PrivateRoute>}
            />
          ))}
          <Route path={Path.Settings} element={<ActivitySettings />}>
            <Route
              path=":setting"
              element={
                <PrivateRoute>
                  <ActivitySettings />
                </PrivateRoute>
              }
            />
          </Route>
        </Route>
      </Route>
      <Route path={Path.ActivityFlow}>
        <Route element={<BuilderActivityFlow />} path=":activityFlowId">
          <Route index element={<Navigate to={Path.About} replace />} />
          {newAppletNewActivityFlowRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{Component ? <Component /> : <></>}</PrivateRoute>}
            />
          ))}
        </Route>
      </Route>
    </Route>
  </Route>
);
