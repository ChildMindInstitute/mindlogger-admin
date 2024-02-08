import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { ServerVerifyErrorPopup } from './ServerVerifyErrorPopup';

const setPopupVisibleMock = jest.fn();

describe('ServerVerifyErrorPopup', () => {
  test('should render', () => {
    renderWithProviders(<ServerVerifyErrorPopup popupVisible={true} setPopupVisible={setPopupVisibleMock} />);

    const popup = screen.getByTestId('applet-settings-report-config-verify-server-error-popup');
    expect(popup).toBeInTheDocument();

    expect(popup).toHaveTextContent(
      "Sorry, we were unable to verify the Server. Please check the 'Encryption Server IP Address' and the 'Public Encryption Key' entries",
    );

    fireEvent.click(screen.getByText('Ok'));

    expect(setPopupVisibleMock).toBeCalledWith(false);
  });
});
