import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ConfirmScheduledAccessPopup } from './ConfirmScheduledAccessPopup';

const onCloseMock = jest.fn();
const onSubmitMock = jest.fn();

describe('ConfirmScheduledAccessPopup', () => {
  test('should render and submit', () => {
    renderWithProviders(
      <ConfirmScheduledAccessPopup
        open={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        isLoading={false}
        activityName="New Activity"
      />,
    );

    const popup = screen.getByTestId('dashboard-calendar-confirm-scheduled-access-popup');
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveTextContent(
      'Activity New Activity will no longer be always available, and the Activity will be a scheduled event. Are you sure you want to continue?',
    );

    fireEvent.click(screen.getByText('Confirm'));

    expect(onSubmitMock).toBeCalled();
  });

  test('should show spinner and disable submit when isLoading true', () => {
    renderWithProviders(
      <ConfirmScheduledAccessPopup
        open={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        isLoading={true}
        activityName="New Activity"
      />,
    );

    expect(screen.getByTestId('spinner')).toBeVisible();
    expect(screen.getByText('Confirm')).toBeDisabled();

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCloseMock).toBeCalled();
  });
});
