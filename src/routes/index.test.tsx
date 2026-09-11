import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';

import { setupStore } from 'redux/store';
import { page } from 'resources';
import { authStorage, SessionStorageKeys } from 'shared/utils';

import history from './history';

import AppRoutes from '.';

vi.mock('shared/layouts/BaseLayout', () => ({
  default: () => <div data-testid="base-layout" />,
}));

vi.mock('modules/Auth/layouts/AuthLayout', () => ({
  default: () => <div data-testid="auth-layout" />,
}));

const renderRoutes = () => {
  const store = setupStore();

  render(
    <Provider store={store}>
      <Suspense fallback={null}>
        <AppRoutes />
      </Suspense>
    </Provider>,
  );

  return store;
};

describe('AppRoutes', () => {
  beforeEach(() => {
    sessionStorage.clear();
    history.push(page.login);
  });

  test('signs the user in from the tokens the tab holds', async () => {
    authStorage.setAccessToken('access-token');
    const store = renderRoutes();

    await waitFor(() => expect(store.getState().auth.authentication.status).toBe('loading'));
  });

  // The tokens belong to whoever signed in after this tab went to sleep.
  test('shows the login page instead when the session has ended', async () => {
    authStorage.setAccessToken('access-token');
    sessionStorage.setItem(SessionStorageKeys.SessionEnded, 'true');
    const store = renderRoutes();

    await waitFor(() => expect(screen.getByTestId('auth-layout')).toBeInTheDocument());
    expect(store.getState().auth.authentication.status).toBe('idle');
  });
});
