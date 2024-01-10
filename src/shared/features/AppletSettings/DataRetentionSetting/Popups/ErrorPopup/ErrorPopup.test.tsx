import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { ErrorPopup } from './ErrorPopup';

const setPopupVisibleMock = jest.fn();
const retryCallbackMock = jest.fn();

describe('ErrorPopup', () => {
  test('should render and retry', () => {
    const dataTestid = 'error-popup';
    renderWithProviders(
      <ErrorPopup
        popupVisible={true}
        setPopupVisible={setPopupVisibleMock}
        retryCallback={retryCallbackMock}
        data-testid={dataTestid}
      />,
    );

    expect(screen.getByTestId(dataTestid)).toBeVisible();
    expect(
      screen.getByText('The \'Data Retention\' setting has not been updated. Please try again.'),
    ).toBeVisible();

    fireEvent.click(screen.getByText('Retry'));

    expect(setPopupVisibleMock).toBeCalledWith(false);
    expect(retryCallbackMock).toBeCalled();
  });

  test('should close on cancel click', () => {
    renderWithProviders(
      <ErrorPopup
        popupVisible={true}
        setPopupVisible={setPopupVisibleMock}
        retryCallback={retryCallbackMock}
      />,
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(setPopupVisibleMock).toBeCalledWith(false);
  });
});
