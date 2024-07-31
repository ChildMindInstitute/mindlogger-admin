import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ConfigurationPopup } from './ConfigurationPopup';
import { ConfigurationPopupProps } from './ConfigurationPopup.types';

const defaultProps: ConfigurationPopupProps = {
  open: true,
  onClose: jest.fn(),
};

describe('ConfigurationPopup', () => {
  test('renders the modal with the correct title', () => {
    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    expect(screen.getByTestId('loris-configuration-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Configuration')).toBeInTheDocument();
  });

  test('renders the form fields correctly', () => {
    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    expect(
      screen.getByText('Please enter your LORIS hostname and credentionals.'),
    ).toBeInTheDocument();
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

    expect(screen.getByText('Server hostname is required'));
    expect(screen.getByText('Username is required'));
    expect(screen.getByText('Password is required'));
  });

  test('navigates to the next step when onNext is called', async () => {
    renderWithProviders(<ConfigurationPopup {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/LORIS Server Hostname/i), 'hostname');
    await userEvent.type(screen.getByLabelText(/LORIS Username/i), 'jande.doe');
    await userEvent.type(screen.getByLabelText(/LORIS Password/i), '123456');
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    expect(
      screen.getByText('Select the LORIS project you wish to connect this applet to.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('loris-project-select')).toBeInTheDocument();

    // test back button
    await userEvent.click(screen.getByTestId('loris-configuration-popup-left-button'));
    expect(
      screen.getByText('Please enter your LORIS hostname and credentionals.'),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('loris-configuration-popup-submit-button'));

    // TODO: add test when the endpoints are ready
  });
});
