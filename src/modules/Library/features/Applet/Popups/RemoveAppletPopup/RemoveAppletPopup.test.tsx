import { waitFor, screen, fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet } from 'shared/mock';
import { page } from 'resources';

import { RemoveAppletPopup } from './RemoveAppletPopup';

const route = page.libraryCart;

const onCloseMock = jest.fn();

describe('RemoveAppletPopup library component tests', () => {
  test('should remove applet form cart', async () => {
    renderWithProviders(
      <RemoveAppletPopup
        removeAppletPopupVisible={true}
        setRemoveAppletPopupVisible={onCloseMock}
        appletName={mockedApplet.displayName}
        appletId={mockedApplet.id}
        isAuthorized={false}
        cartItems={[]}
      />,
      {
        route,
        routePath: route,
      },
    );

    const confirmBtn = await waitFor(() => screen.getByText('Yes, Remove'));
    fireEvent.click(confirmBtn);
    expect(onCloseMock).toHaveBeenCalledWith(false);
  });
});
