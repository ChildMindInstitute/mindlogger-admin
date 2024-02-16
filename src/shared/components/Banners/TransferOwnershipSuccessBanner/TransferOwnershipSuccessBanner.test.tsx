import { fireEvent, render, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { TransferOwnershipSuccessBanner } from './TransferOwnershipSuccessBanner';

const mockOnClose = jest.fn();

const props = {
  email: 'test@example.com',
  onClose: mockOnClose,
};

describe('TransferOwnershipSuccessBanner', () => {
  test('should render', () => {
    renderWithProviders(<TransferOwnershipSuccessBanner {...props} />);

    expect(screen.getByTestId('transfer-ownership-success-banner')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your request has been successfully sent to . Please wait for receiver to accept your request.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(props.email)).toBeInTheDocument();
  });

  test('clicking the close button hides the banner', () => {
    render(<TransferOwnershipSuccessBanner {...props} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
