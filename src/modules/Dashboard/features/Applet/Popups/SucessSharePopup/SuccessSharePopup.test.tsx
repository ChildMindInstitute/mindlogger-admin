import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet } from 'shared/mock';

import { SuccessSharePopup } from './SuccessSharePopup';

const setSharePopupVisibleMock = vi.fn();
const dataTestId = 'applet-settings-share-to-library-success-popup';

describe('SuccessSharePopup', () => {
  test('should render and submit', () => {
    renderWithProviders(
      <SuccessSharePopup
        applet={mockedApplet}
        keywords={['keyword1']}
        libraryUrl="libraryUrl"
        sharePopupVisible={true}
        setSharePopupVisible={setSharePopupVisibleMock}
        data-testid={dataTestId}
      />,
    );

    expect(screen.getByTestId(dataTestId)).toBeVisible();
    expect(screen.getByText('displayName')).toBeVisible();
    expect(screen.getByText('keyword1')).toBeVisible();

    fireEvent.click(screen.getByText('Ok'));

    expect(setSharePopupVisibleMock).toBeCalledWith(false);
  });
});
