import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import * as hooks from '../Popups.hooks';
import { UnlockAppletPopup } from './UnlockAppletPopup';

const setPopupVisibleMock = jest.fn();

const useCheckIfHasEncryptionMock = jest.spyOn(hooks, 'useCheckIfHasEncryption');

describe('UnlockAppletPopup', () => {
  test('should render enter password popup', async () => {
    useCheckIfHasEncryptionMock.mockReturnValueOnce(false);
    renderWithProviders(
      <UnlockAppletPopup appletId={''} popupVisible={true} setPopupVisible={setPopupVisibleMock} />,
    );

    const popup = screen.getByTestId('unlock-applet-data-popup');
    expect(popup).toBeInTheDocument();
    expect(
      screen.getByTestId('unlock-applet-data-popup-enter-password-password'),
    ).toBeInTheDocument();
  });
});
