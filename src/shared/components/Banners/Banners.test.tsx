import { PreloadedState } from '@reduxjs/toolkit';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { RootState } from 'redux/store';
import { renderWithProviders } from 'shared/utils';

import { Banners } from './Banners';

const preloadedState: PreloadedState<RootState> = {
  banners: {
    data: {
      banners: [{ key: 'VersionWarningBanner' }],
    },
  },
};

describe('Banners', () => {
  test('should render default banner', () => {
    renderWithProviders(<Banners />, { preloadedState });

    expect(screen.getByText('You are using the new version of MindLogger!')).toBeInTheDocument();
  });

  test('should no longer render banner when its close button clicked', async () => {
    renderWithProviders(<Banners />, { preloadedState });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Wait for Collapse transition to complete
    await waitFor(() => {
      expect(screen.queryByText('You are using the new version of MindLogger!')).toBeNull();
    });
  });
});
