import { ReactNode } from 'react';
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react';

import { ExtendedRenderOptions, setupStore } from 'redux/store';
import { page } from 'resources';
import Login from 'modules/Auth/pages/Login';

export const renderHookWithProviders = (
  hook: () => unknown,
  {
    route = '/',
    routePath = '/',
    preloadedState = {},
    store = setupStore(preloadedState),
    ...options
  }: ExtendedRenderOptions = {},
) => {
  const Providers = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={routePath} element={children} />
          <Route path={page.login} element={<Login />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  const rendered = renderHook(hook, { wrapper: Providers, ...options });

  return { ...rendered, store };
};
