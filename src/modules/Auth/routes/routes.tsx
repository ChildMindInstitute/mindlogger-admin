import { lazy } from 'react';
import { Route } from 'react-router-dom';

import { page } from 'resources';

import { routes } from './routes.const';

const Lock = lazy(() => import('../pages/Lock'));

export const authRoutes = () => (
  <>
    {routes.map(({ path, Component }) => (
      <Route key={path} path={path} element={<Component />} />
    ))}
    <Route
      key={page.lock}
      path={page.lock}
      element={
        // TODO: supplement the condition
        <Lock />
      }
    />
  </>
);
