import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { ExtendedRenderOptions, setupStore } from 'redux/store';

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...options
  }: ExtendedRenderOptions = {},
) => {
  const Providers = ({ children }: { children: JSX.Element }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Providers, ...options }) };
};
