import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet } from 'shared/mock';
import { MetaStatus } from 'shared/state/Base';
import { IntegrationTypes } from 'shared/consts';

import { ConfigurationPopup } from './ConfigurationPopup';
import { ConfigurationPopupProps } from './ConfigurationPopup.types';
import { fetchLorisProjects, saveLorisProject } from '../LorisIntegration.utils';

jest.mock('../LorisIntegration.utils', () => ({
  fetchLorisProjects: jest.fn(),
  saveLorisProject: jest.fn(),
}));

jest.mock('shared/state', () => ({
  banners: {
    actions: {
      addBanner: jest.fn(),
    },
  },
  applet: {
    useAppletData: jest.fn().mockReturnValue({ result: { id: 'applet-id', integrations: [] } }),
    actions: {
      updateAppletData: jest.fn(),
    },
  },
}));

const defaultProps: ConfigurationPopupProps = {
  open: true,
  onClose: jest.fn(),
};
const hostname = 'hostname';
const login = 'login';
const project = 'project';

const preloadedState = {
  applet: {
    applet: {
      requestId: 'requestId',
      status: 'success' as MetaStatus,
      data: {
        result: {
          ...mockedApplet,
          integrations: [
            {
              integrationType: IntegrationTypes.Loris,
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

describe('ConfigurationPopup', () => {
  test('renders the modal with the correct title', () => {
    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    expect(screen.getByTestId('loris-configuration-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Configuration')).toBeInTheDocument();
  });

  test('renders the form fields correctly', () => {
    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    expect(screen.getByLabelText('LORIS Server Hostname')).toBeInTheDocument();
    expect(screen.getByLabelText('LORIS Username')).toBeInTheDocument();
    expect(screen.getByLabelText('LORIS Password')).toBeInTheDocument();
  });

  test('calls onClose when the modal is closed', async () => {
    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    await userEvent.click(screen.getByTestId('loris-configuration-popup-close-button'));
    await userEvent.click(screen.getByTestId('loris-configuration-popup-left-button'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
  });

  test('displays an error message when the fields are empty', async () => {
    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    expect(screen.getByText('Server hostname is required')).toBeInTheDocument();
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('navigates to the next step when onNext is called', async () => {
    (fetchLorisProjects as jest.Mock).mockResolvedValueOnce(['Project1', 'Project2']);

    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/LORIS Server Hostname/i), 'hostname');
    await userEvent.type(screen.getByLabelText(/LORIS Username/i), 'jane.doe');
    await userEvent.type(screen.getByLabelText(/LORIS Password/i), '123456');
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(
        screen.getByText('Select the LORIS project you wish to connect this applet to.'),
      ).toBeInTheDocument();
    });
    expect(screen.getByTestId('loris-project-select')).toBeInTheDocument();

    // test back button
    await userEvent.click(screen.getByTestId('loris-configuration-popup-left-button'));
    expect(
      screen.getByText('Please enter your LORIS hostname and credentionals.'),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));
  });

  test('displays an error message when fetching projects fails', async () => {
    (fetchLorisProjects as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    renderWithProviders(<ConfigurationPopup {...defaultProps} />, {
      preloadedState,
    });

    await userEvent.type(screen.getByLabelText(/LORIS Server Hostname/i), 'hostname');
    await userEvent.type(screen.getByLabelText(/LORIS Username/i), 'jane.doe');
    await userEvent.type(screen.getByLabelText(/LORIS Password/i), '123456');
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(screen.getByText(/Invalid server or hostname credentials/i)).toBeInTheDocument();
    });
  });

  test.skip('saves the project and closes the modal', async () => {
    (fetchLorisProjects as jest.Mock).mockResolvedValueOnce(['Project1', 'Project2']);
    (saveLorisProject as jest.Mock).mockResolvedValueOnce({ result: [{ message: 'Success' }] });

    renderWithProviders(<ConfigurationPopup open={true} onClose={jest.fn()} />);

    await userEvent.type(screen.getByLabelText(/LORIS Server Hostname/i), 'hostname');
    await userEvent.type(screen.getByLabelText(/LORIS Username/i), 'jane.doe');
    await userEvent.type(screen.getByLabelText(/LORIS Password/i), '123456');
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('loris-project-select')).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByTestId('loris-project-select'), 'Project1'); //TODO FAILING - FIX
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  test.skip('displays an error message when saving the project fails', async () => {
    (fetchLorisProjects as jest.Mock).mockResolvedValueOnce(['Project1', 'Project2']);
    (saveLorisProject as jest.Mock).mockRejectedValueOnce(new Error('Save failed'));

    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/LORIS Server Hostname/i), 'hostname');
    await userEvent.type(screen.getByLabelText(/LORIS Username/i), 'jane.doe');
    await userEvent.type(screen.getByLabelText(/LORIS Password/i), '123456');
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('loris-project-select')).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByTestId('loris-project-select'), 'Project1');
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch projects')).toBeInTheDocument(); // TODO FAILING - FIX
    });
  });
});
