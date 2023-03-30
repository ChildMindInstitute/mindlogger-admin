import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';
import { Path } from 'shared/utils';
import BuilderAppletSettings from 'modules/Builder/features/BuilderAppletSettings';

import {
  newAppletNewActivityFlowRoutes,
  newAppletRoutes,
  newAppletNewActivityRoutes,
} from './routes.const';

const Main = lazy(() => import('../pages/Main'));
const NewApplet = lazy(() => import('../pages/NewApplet'));
const NewActivityFlow = lazy(() => import('../pages/NewActivityFlow'));
const NewActivity = lazy(() => import('../pages/NewActivity'));

export const builderRoutes = () => (
  <Route path={page.builder}>
    <Route
      path={page.builder}
      element={
        <PrivateRoute>
          <Main />
        </PrivateRoute>
      }
    />
    <Route element={<NewApplet />} path=":appletId">
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
        <Route element={<NewActivity />} path=":activityId">
          <Route index element={<Navigate to={Path.About} replace />} />
          {newAppletNewActivityRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{Component ? <Component /> : <></>}</PrivateRoute>}
            />
          ))}
        </Route>
      </Route>
      <Route path={Path.ActivityFlow}>
        <Route element={<NewActivityFlow />} path=":activityFlowId">
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
