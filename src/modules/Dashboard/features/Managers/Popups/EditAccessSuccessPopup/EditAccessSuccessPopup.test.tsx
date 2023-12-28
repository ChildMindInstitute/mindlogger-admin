import { render, screen, fireEvent } from '@testing-library/react';

import { EditAccessSuccessPopup } from './EditAccessSuccessPopup';

const onClose = jest.fn();
const mockProps = {
  onClose,
  open: true,
  email: 'test@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
};

describe('EditAccessSuccessPopup', () => {
  test('renders component with correct content', () => {
    render(<EditAccessSuccessPopup {...mockProps} />);

    expect(screen.getByText('Edit Access')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe (test@example.com)')).toBeInTheDocument();
    expect(
      screen.getByTestId('dashboard-managers-edit-access-popup-success-popup'),
    ).toBeInTheDocument();
  });

  test('calls onClose when the modal is closed', () => {
    render(<EditAccessSuccessPopup {...mockProps} />);

    fireEvent.click(screen.getByText('Ok'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
