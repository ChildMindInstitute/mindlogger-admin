import { waitFor, screen, fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { page } from 'resources';

import { AuthPopup } from './AuthPopup';

const route = page.libraryCart;

const onCloseMock = jest.fn();

describe('AuthPopup library component tests', () => {
  test('should remove applet form cart', async () => {
    renderWithProviders(<AuthPopup authPopupVisible={true} setAuthPopupVisible={onCloseMock} />, {
      route,
      routePath: route,
    });

    const confirmBtn = await waitFor(() => screen.getByText('Yes, authorize'));
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(screen.getByText('Log into your MindLogger account')).toBeInTheDocument();
    });
  });
});
