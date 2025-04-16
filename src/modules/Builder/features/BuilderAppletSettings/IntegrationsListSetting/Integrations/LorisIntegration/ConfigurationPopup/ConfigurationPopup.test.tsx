import { screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet } from 'shared/mock';
import { MetaStatus } from 'shared/state/Base';
import { IntegrationTypes } from 'shared/consts';
import { RootState } from 'redux/store';
import { applet } from 'shared/state/Applet';

import { ConfigurationPopup } from './ConfigurationPopup';
import { ConfigurationPopupProps } from './ConfigurationPopup.types';
import { fetchLorisProjects, saveLorisProject } from '../LorisIntegration.utils';

jest.mock('../LorisIntegration.utils', () => ({
  fetchLorisProjects: vi.fn(),
  saveLorisProject: vi.fn(),
}));

const defaultProps: ConfigurationPopupProps = {
  open: true,
  onClose: vi.fn(),
};
const hostname = 'hostname';
const username = 'username';
const project = 'project';

const preloadedState = {
  applet: {
    id: 'applet-id',
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
                username,
                project,
              },
            },
          ],
        },
      },
    },
  },
} as Pick<RootState, 'applet'>;

const fillForm = async () => {
  await userEvent.type(screen.getByLabelText(/LORIS Server Hostname/i), 'hostname');
  await userEvent.type(screen.getByLabelText(/LORIS Username/i), 'jane.doe');
  await userEvent.type(screen.getByLabelText(/LORIS Password/i), '123456');
};

const selectProject = async () => {
  await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));
  await waitFor(() => {
    expect(screen.getByTestId('loris-project-select')).toBeInTheDocument();
  });
  const selectCompoEl = screen.getByTestId('loris-project-select');
  const button = within(selectCompoEl).getByRole('button');
  fireEvent.mouseDown(button);
  const listbox = within(screen.getByRole('presentation')).getByRole('listbox');
  const options = within(listbox).getAllByRole('option');
  fireEvent.click(options[0]);
};

describe('ConfigurationPopup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    await fillForm();
    await selectProject();

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

    await fillForm();
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(screen.getByText(/Invalid server or hostname credentials/i)).toBeInTheDocument();
    });
  });

  test('saves the project and closes the modal', async () => {
    (fetchLorisProjects as jest.Mock).mockResolvedValueOnce(['Project1', 'Project2']);
    (saveLorisProject as jest.Mock).mockResolvedValue({ result: [{ message: 'Success' }] });
    jest.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });

    renderWithProviders(<ConfigurationPopup {...defaultProps} />, {
      preloadedState,
    });

    await fillForm();
    await selectProject();

    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  test('displays an error message when saving the project fails', async () => {
    jest.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
    (fetchLorisProjects as jest.Mock).mockResolvedValueOnce(['Project1', 'Project2']);
    (saveLorisProject as jest.Mock).mockRejectedValueOnce(new Error('Save failed'));

    renderWithProviders(<ConfigurationPopup {...defaultProps} />, {
      preloadedState,
    });

    await fillForm();
    await selectProject();

    screen.logTestingPlaygroundURL();
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Failed to save project')).toBeInTheDocument();
    });
  });

  test('displays an error message when the applet is already tied to a project', async () => {
    jest.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
    (fetchLorisProjects as jest.Mock).mockResolvedValueOnce(['Project1', 'Project2']);
    (saveLorisProject as jest.Mock).mockResolvedValueOnce({
      result: [{ message: 'This project has previously been tied to applet' }],
    });

    renderWithProviders(<ConfigurationPopup {...defaultProps} />, {
      preloadedState,
    });

    await fillForm();
    await selectProject();

    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    await waitFor(() => {
      expect(
        screen.getByText('This applet is already tied to a LORIS project'),
      ).toBeInTheDocument();
    });
  });
});
