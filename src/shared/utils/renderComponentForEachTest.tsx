import { RenderResult } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

export const renderComponentForEachTest = (Component: JSX.Element) => {
  let container = null as RenderResult | null;

  beforeEach(() => {
    container = renderWithProviders(Component);
  });

  afterEach(() => {
    if (container) {
      container.unmount();
      container = null;
    }
  });
};
