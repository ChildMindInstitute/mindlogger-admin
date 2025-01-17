import { render } from '@testing-library/react';
import { screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '@reduxjs/toolkit';

import { mockedApplet } from 'shared/mock';

import { ProlificIntegration } from './ProlificIntegration';
import { prolificIntegrationExists } from './ProlificIntegration.utils';

jest.mock('./ProlificIntegration.utils', () => ({
  prolificIntegrationExists: jest.fn(),
}));

const preloadedStateWithoutIntegration = {
  applet: {
    applet: {
      data: {
        result: {
          ...mockedApplet,
        },
      },
    },
  },
};
type AppletState = typeof preloadedStateWithoutIntegration;

const renderWithStore = (preloadedState: AppletState) =>
  render(
    <Provider store={createStore(() => preloadedState)}>
      <ProlificIntegration />
    </Provider>,
  );

describe('ProlificIntegration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the ProlificIntegration component when api token does not exist', () => {
    (prolificIntegrationExists as jest.Mock).mockResolvedValue(false);

    renderWithStore(preloadedStateWithoutIntegration);

    expect(screen.getByTestId('prolific-integration')).toBeInTheDocument();
    expect(screen.getByText('Prolific')).toBeInTheDocument();
    expect(screen.getByTestId('prolific-connect')).toBeInTheDocument();
    expect(screen.getByTestId('prolific-description')).toBeInTheDocument();
    expect(screen.queryByTestId('prolific-disconnect')).toBeNull();

    expect(screen.queryByTestId('prolific-configuration-popup')).toBeNull();
  });

  test('should render the ProlificIntegration connected component when api token exists', async () => {
    (prolificIntegrationExists as jest.Mock).mockResolvedValue(true);

    renderWithStore(preloadedStateWithoutIntegration);

    expect(await screen.findByTestId('prolific-connected')).toBeInTheDocument();
    expect(await screen.findByTestId('prolific-connected')).toHaveTextContent('Connected');

    expect(await screen.findByTestId('prolific-integration')).toBeInTheDocument();
    expect(screen.queryByTestId('prolific-configuration-popup')).toBeNull();
    expect(screen.queryByTestId('prolific-disconnect')).toBeInTheDocument();
  });
});
