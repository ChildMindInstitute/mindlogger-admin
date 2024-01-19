import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { SuccessPopup } from './SuccessPopup';

const onCloseMock = jest.fn();

describe('SuccessPopup', () => {
  test('should render and submit', () => {
    const dataTestid = 'success-popup';
    renderWithProviders(
      <SuccessPopup popupVisible={true} onClose={onCloseMock} data-testid={dataTestid} />,
    );

    expect(screen.getByTestId(dataTestid)).toBeVisible();
    expect(screen.getByText('Data Retention setting has been updated successfully.')).toBeVisible();

    fireEvent.click(screen.getByText('Ok'));

    expect(onCloseMock).toBeCalled();
  });
});
