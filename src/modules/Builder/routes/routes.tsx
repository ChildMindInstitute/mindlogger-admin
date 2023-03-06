import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';

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
    <Route element={<NewApplet />} path={page.newApplet}>
      <Route path={page.newApplet} element={<Navigate to={page.newAppletAbout} replace />} />
      {newAppletRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={<PrivateRoute>{Component ? <Component /> : <></>}</PrivateRoute>}
        />
      ))}
      <Route path={page.newAppletActivities}>
        <Route element={<NewActivity />} path={page.newAppletNewActivity}>
          <Route
            path={page.newAppletNewActivity}
            element={<Navigate to={page.newAppletNewActivityAbout} replace />}
          />
          {newAppletNewActivityRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{Component ? <Component /> : <></>}</PrivateRoute>}
            />
          ))}
        </Route>
      </Route>
      <Route path={page.newAppletActivityFlow}>
        <Route element={<NewActivityFlow />} path={page.newAppletNewActivityFlow}>
          <Route
            path={page.newAppletNewActivityFlow}
            element={<Navigate to={page.newAppletNewActivityFlowAbout} replace />}
          />
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
