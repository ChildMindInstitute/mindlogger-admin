// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render } from '@testing-library/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate, useParams } from 'react-router-dom';
import { Provider } from 'react-redux';

import { mockedApplet } from 'shared/mock';
import { createStore } from 'redux';
import { useIsServerConfigured } from 'shared/hooks/useIsServerConfigured';

import { LorisIntegration } from './LorisIntegration';

const hostname = 'hostname';
const login = 'login';
const project = 'project';

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

const preloadedStateWithIntegration = {
  applet: {
    applet: {
      data: {
        result: {
          ...mockedApplet,
          integrations: [
            {
              integrationType: 'LORIS',
              configuration: {
                hostname,
                login,
                project,
              },
            },
          ],
        },
      },
    },
  },
};

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  generatePath: jest.fn(),
}));

jest.mock('shared/hooks/useIsServerConfigured', () => ({
  useIsServerConfigured: jest.fn(),
}));

jest.mock('redux/modules', () => ({
  applet: {
    useAppletData: jest.fn(),
  },
}));

const renderWithStore = (preloadedState) =>
  render(
    <Provider store={createStore(() => preloadedState)}>
      <LorisIntegration />
    </Provider>,
  );

describe('LorisIntegration', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigate);
    useParams.mockReturnValue({ appletId: 'appletId' });
  });

  test('should render the LorisIntegration component with server not configured', () => {
    useIsServerConfigured.mockReturnValue(false);

    renderWithStore(preloadedStateWithoutIntegration);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    expect(screen.getByText('LORIS')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This integration will allow you to decrypt and upload responses from this applet to your LORIS database.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('loris-integration-description')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  test('should render the LorisIntegration component with server configured and integration enabled', () => {
    useIsServerConfigured.mockReturnValue(true);

    renderWithStore(preloadedStateWithIntegration);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    expect(screen.getByText('LORIS')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This integration will allow you to decrypt and upload responses from this applet to your LORIS database.',
      ),
    );
    expect(screen.getByText('Disconnect from LORIS')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  test('should show ConfigurationPopup when connect button is clicked', async () => {
    useIsServerConfigured.mockReturnValue(true);

    renderWithStore(preloadedStateWithoutIntegration);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('loris-integration-connect-button'));

    expect(screen.getByTestId('loris-configuration-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Configuration')).toBeInTheDocument();
  });

  test('should show DisconnectionPopup when disconnect text is clicked', async () => {
    useIsServerConfigured.mockReturnValue(true);

    renderWithStore(preloadedStateWithIntegration);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('loris-integration-disconnect-button'));

    expect(screen.getByTestId('loris-disconnection-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Configuration')).toBeInTheDocument();
    expect(screen.getByText(hostname)).toBeInTheDocument();
    expect(screen.getByText(project)).toBeInTheDocument();
  });

  test('should show UploadPopup when upload button is clicked', async () => {
    useIsServerConfigured.mockReturnValue(true);

    renderWithStore(preloadedStateWithIntegration);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('loris-integration-upload-button'));

    expect(screen.getByTestId('loris-upload-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Data Upload')).toBeInTheDocument();
  });

  test('should redirect to report configuration when Report Configuration link is clicked', async () => {
    useIsServerConfigured.mockReturnValue(false);

    renderWithStore(preloadedStateWithoutIntegration);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Report Configuration'));
    expect(navigate).toHaveBeenCalledWith(
      '/builder/2e46fa32-ea7c-4a76-b49b-1c97d795bb9a/settings/report-configuration',
    );
  });
});
