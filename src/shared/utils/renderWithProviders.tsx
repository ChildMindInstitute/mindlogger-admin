import { render } from '@testing-library/react';
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { ExtendedRenderOptions, setupStore } from 'redux/store';
import { page } from 'resources';
import Login from 'modules/Auth/pages/Login';

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    route = '/',
    routePath = '/',
    preloadedState = {},
    store = setupStore(preloadedState),
    ...options
  }: ExtendedRenderOptions = {},
) => {
  const Providers = ({ children }: { children: JSX.Element }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={routePath} element={children} />
          <Route path={page.login} element={<Login />} />
          <Route path={page.dashboardApplets} element={<></>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  return { ...render(ui, { wrapper: Providers, ...options }), store };
};
