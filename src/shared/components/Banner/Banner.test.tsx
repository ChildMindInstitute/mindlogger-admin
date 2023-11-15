import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Banner } from './Banner';
import { BANNER_LINK } from './Banner.const';

describe('Banner', () => {
  test('clicking the close button hides the banner', async () => {
    render(<Banner />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText('You are using the new version of MindLogger!')).not.toBeVisible();
    });
  });

  test('link has correct URL and opens in a new tab', () => {
    render(<Banner />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', BANNER_LINK);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
