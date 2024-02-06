import { render, screen, fireEvent } from '@testing-library/react';

import { VersionWarningBanner } from './VersionWarningBanner';
import { BANNER_LINK } from './VersionWarningBanner.const';

const mockOnClose = jest.fn();

describe('VersionWarningBanner', () => {
  test('clicking the close button hides the banner', () => {
    render(<VersionWarningBanner onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('link has correct URL and opens in a new tab', () => {
    render(<VersionWarningBanner />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', BANNER_LINK);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
