import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { SuccessTransferOwnershipPopup } from './SuccessTransferOwnershipPopup';

const closeTransferOwnershipPopupMock = jest.fn();

describe('SuccessTransferOwnershipPopup', () => {
  test('should render and submit', () => {
    const dataTestId = 'success-transfer-popup';
    renderWithProviders(
      <SuccessTransferOwnershipPopup
        email="test@test.com"
        transferOwnershipPopupVisible={true}
        closeTransferOwnershipPopup={closeTransferOwnershipPopupMock}
        data-testid={dataTestId}
      />,
    );

    const popup = screen.getByTestId(dataTestId);
    expect(popup).toBeVisible();
    expect(popup).toHaveTextContent(
      'Your request has been successfully sent to test@test.com. Please wait for receiver to accept your request.',
    );

    fireEvent.click(screen.getByText('Ok'));

    expect(closeTransferOwnershipPopupMock).toBeCalled();
  });
});
