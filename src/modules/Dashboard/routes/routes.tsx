import { lazy } from 'react';
import { Route } from 'react-router-dom';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';

import { appletRoutes } from './routes.const';

const Main = lazy(() => import('../pages/Main'));
const Applet = lazy(() => import('../pages/Applet'));

export const dashBoardRoutes = () => (
  <Route path={page.dashboard}>
    <Route
      path={page.dashboard}
      element={
        <PrivateRoute>
          <Main />
        </PrivateRoute>
      }
    />
    <Route element={<Applet />}>
      {appletRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <Component />
            </PrivateRoute>
          }
        />
      ))}
    </Route>
  </Route>
);
