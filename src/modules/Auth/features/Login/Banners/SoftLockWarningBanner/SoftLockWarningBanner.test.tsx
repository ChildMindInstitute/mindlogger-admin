import { render, screen, fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { SoftLockWarningBanner } from './SoftLockWarningBanner';

const mockOnClose = vi.fn();

describe('SoftLockWarningBanner', () => {
  test('should render', () => {
    renderWithProviders(<SoftLockWarningBanner />);

    expect(screen.getByTestId('warning-banner')).toBeInTheDocument();
    expect(
      screen.getByText('To keep your account secure, you were automatically logged out.'),
    ).toBeInTheDocument();
  });

  test('clicking the close button hides the banner', () => {
    render(<SoftLockWarningBanner onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
