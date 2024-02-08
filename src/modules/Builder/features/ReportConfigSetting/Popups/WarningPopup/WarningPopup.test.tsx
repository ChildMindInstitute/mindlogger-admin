import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { WarningPopup } from './WarningPopup';

const setPopupVisibleMock = jest.fn();
const submitCallbackMock = jest.fn();

describe('WarningPopup', () => {
  test('should render', () => {
    renderWithProviders(
      <WarningPopup popupVisible={true} setPopupVisible={setPopupVisibleMock} submitCallback={submitCallbackMock} />,
    );

    const popup = screen.getByTestId('builder-applet-settings-report-config-setting-save-anyway-popup');
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveTextContent(
      "A report can not be generated until the 'Encryption Server IP Address' and the 'Public Encryption Key' are entered.",
    );

    fireEvent.click(screen.getByText('Save anyway'));

    expect(setPopupVisibleMock).toBeCalledWith(false);
    expect(submitCallbackMock).toBeCalled();
  });
});
