import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DisconnectionPopup } from './DisconnectionPopup';

describe.skip('DisconnectionPopup', () => {
  const mockOnClose = jest.fn();

  test('should render the DisconnectionPopup component', () => {
    render(<DisconnectionPopup open={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('loris-disconnection-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Configuration')).toBeInTheDocument();
    expect(screen.getByText('Your applet is currently connected to:')).toBeInTheDocument();
    expect(screen.getByTestId('connection-info')).toBeInTheDocument();

    const leftButton = screen.getByTestId('loris-disconnection-popup-left-button');
    expect(leftButton).toBeInTheDocument();
    expect(leftButton.textContent).toEqual('Cancel');

    const submitButton = screen.getByTestId('loris-disconnection-popup-submit-button');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton.textContent).toEqual('Disconnect from LORIS');
  });

  test('should handle right button click to change step', async () => {
    render(<DisconnectionPopup open={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('loris-disconnection-popup')).toBeInTheDocument();
    const submitButton1 = screen.getByTestId('loris-disconnection-popup-submit-button');

    await userEvent.click(submitButton1);

    expect(
      screen.getByText(
        'Are you sure you want to disconnect this applet from LORIS? You will need to re-enter your LORIS credentials to connect again.',
      ),
    ).toBeInTheDocument();

    const submitButton2 = screen.getByTestId('loris-disconnection-popup-submit-button');
    expect(submitButton2.textContent).toEqual('Confirm');
  });

  test('should handle left button click to close', async () => {
    render(<DisconnectionPopup open={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('loris-disconnection-popup')).toBeInTheDocument();
    const leftButton = screen.getByTestId('loris-disconnection-popup-left-button');

    await userEvent.click(leftButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
