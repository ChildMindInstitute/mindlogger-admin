import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Route, Routes, MemoryRouter } from 'react-router-dom';

import Login from 'modules/Auth/pages/Login';
import { ExtendedRenderOptions, setupStore } from 'redux/store';
import { page } from 'resources';

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
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  return { ...render(ui, { wrapper: Providers, ...options }), store };
};
