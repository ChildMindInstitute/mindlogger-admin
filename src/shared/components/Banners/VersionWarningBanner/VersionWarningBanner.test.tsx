import { render, screen, fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { VersionWarningBanner } from './VersionWarningBanner';
import { VERSION_WARNING_BANNER_LINK } from './VersionWarningBanner.const';

const mockOnClose = vi.fn();

describe('VersionWarningBanner', () => {
  test('should render', () => {
    renderWithProviders(<VersionWarningBanner />);

    expect(screen.getByTestId('warning-banner')).toBeInTheDocument();
    expect(screen.getByText('You are using the new version of MindLogger!')).toBeInTheDocument();
  });

  test('clicking the close button hides the banner', () => {
    render(<VersionWarningBanner onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('link has correct URL and opens in a new tab', () => {
    render(<VersionWarningBanner />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', VERSION_WARNING_BANNER_LINK);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
