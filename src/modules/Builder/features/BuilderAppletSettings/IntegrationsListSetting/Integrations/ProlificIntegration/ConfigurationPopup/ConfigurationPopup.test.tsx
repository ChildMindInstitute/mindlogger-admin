import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet } from 'shared/mock';

import { ConfigurationPopup } from './ConfigurationPopup';
import { PopupProps } from '../ProlificIntegration.types';
import { createProlificIntegration } from '../ProlificIntegration.utils';

jest.mock('../ProlificIntegration.utils', () => ({
  createProlificIntegration: jest.fn(),
}));

type ConfigurationPopupProps = PopupProps;

const preloadedStateWithIntegration = {
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

const defaultApplet = preloadedStateWithIntegration.applet.applet.data.result;

describe('ProlificIntegration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the DisconnectionPopup', () => {
    const defaultProps: ConfigurationPopupProps = {
      open: true,
      onClose: jest.fn(),
      applet: defaultApplet,
      updateAppletData: jest.fn(),
    };

    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    expect(screen.getByTestId('prolific-configuration-popup')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Where can I find my Prolific API token?')).toBeInTheDocument();
    expect(screen.getByTestId('prolific-description-popup')).toBeInTheDocument();

    expect(screen.queryByTestId('prolific-disconnect-popup')).toBeNull();
    expect(screen.queryByTestId('prolific-integration')).toBeNull();

    expect(screen.getByText(/Submit/i).closest('button')).toBeDisabled();
  });

  test('should close popup and update applet when clicking submit', async () => {
    (createProlificIntegration as jest.Mock).mockImplementation();

    const onClose = jest.fn();
    const updateAppletData = jest.fn();

    renderWithProviders(
      <ConfigurationPopup
        onClose={onClose}
        updateAppletData={updateAppletData}
        applet={defaultApplet}
        open={true}
      />,
    );

    expect(screen.getByText(/Submit/i).closest('button')).toBeDisabled();

    const apiTokenInput = screen.getByLabelText(/Prolific API Token/i);
    await userEvent.type(apiTokenInput, 'test-api-token');

    expect(screen.getByText(/Submit/i).closest('button')).toBeEnabled();

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(updateAppletData).toHaveBeenCalled();
    });
  });

  test('should show error when api token is wrong', async () => {
    (createProlificIntegration as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid API token');
    });

    const onClose = jest.fn();
    const updateAppletData = jest.fn();

    renderWithProviders(
      <ConfigurationPopup
        onClose={onClose}
        updateAppletData={updateAppletData}
        applet={defaultApplet}
        open={true}
      />,
    );

    expect(screen.getByText(/Submit/i).closest('button')).toBeDisabled();

    const apiTokenInput = screen.getByLabelText(/Prolific API Token/i);
    await userEvent.type(apiTokenInput, 'wrong-api-token');

    expect(screen.getByText(/Submit/i).closest('button')).toBeEnabled();

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled();
      expect(updateAppletData).not.toHaveBeenCalled();
      expect(screen.queryByTestId('prolific-upload-data-popup-error')).toBeInTheDocument();
    });
  });
});
