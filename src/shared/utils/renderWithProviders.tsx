import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';

import { ExtendedRenderOptions, setupStore } from 'redux/store';
import { page } from 'resources';
import Login from 'modules/Auth/pages/Login';
import theme from 'shared/styles/theme';

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
  const Providers = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={routePath} element={children} />
            <Route path={page.login} element={<Login />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );

  return { ...render(ui, { wrapper: Providers, ...options }), store };
};
