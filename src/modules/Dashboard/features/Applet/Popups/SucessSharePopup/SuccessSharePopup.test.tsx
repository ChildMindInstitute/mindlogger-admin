import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { mockedApplet } from 'shared/mock';

import { SuccessSharePopup } from './SuccessSharePopup';

const setSharePopupVisibleMock = jest.fn();

describe('SuccessSharePopup', () => {
  test('should render and submit', () => {
    renderWithProviders(
      <SuccessSharePopup
        applet={mockedApplet}
        keywords={[]}
        libraryUrl="libraryUrl"
        sharePopupVisible={true}
        setSharePopupVisible={setSharePopupVisibleMock}
      />,
    );

    expect(screen.getByTestId('dashboard-applets-share-popup-success-popup')).toBeVisible();

    fireEvent.click(screen.getByText('Ok'));

    expect(setSharePopupVisibleMock).toBeCalledWith(false);
  });
});
