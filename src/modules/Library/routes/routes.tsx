import { Route } from 'react-router-dom';

import { page } from 'resources';

import { routes } from './routes.const';

export const libraryRoutes = () => (
  <Route path={page.library}>
    {routes.map(({ path, Component }) => (
      <Route key={path} path={path} element={<Component />} />
    ))}
  </Route>
);
