import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ErrorPopup } from './ErrorPopup';

const setPopupVisibleMock = vi.fn();
const retryCallbackMock = vi.fn();

describe('ErrorPopup', () => {
  test('should render', () => {
    renderWithProviders(
      <ErrorPopup
        popupVisible={true}
        setPopupVisible={setPopupVisibleMock}
        retryCallback={retryCallbackMock}
      />,
    );

    expect(
      screen.getByTestId('builder-activity-flows-settings-report-config-form-error-popup'),
    ).toBeInTheDocument();
    expect(screen.getByText('Sorry, we couldn’t save those changes.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Retry'));

    expect(setPopupVisibleMock).toBeCalledWith(false);
    expect(retryCallbackMock).toBeCalled();

    fireEvent.click(screen.getByText('Cancel'));

    expect(setPopupVisibleMock).toBeCalledWith(false);
  });
});
