import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { RemoveAllScheduledEventsPopup } from './RemoveAllScheduledEventsPopup';

const onCloseMock = jest.fn();
const onSubmitMock = jest.fn();

describe('RemoveAllScheduledEventsPopup', () => {
  test('should render and submit', () => {
    renderWithProviders(
      <RemoveAllScheduledEventsPopup
        open={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        activityName="New Activity"
        data-testid="remove-all-scheduled-events-popup"
        isLoading={false}
      />,
    );

    const popup = screen.getByTestId('remove-all-scheduled-events-popup');
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveTextContent(
      'All scheduled events for New Activity will be removed, and the activity will become always available to the user. Are you sure you want to continue?',
    );

    fireEvent.click(screen.getByText('Remove'));

    expect(onSubmitMock).toBeCalled();
  });

  test('should show spinner and disable submit when isLoading true', () => {
    renderWithProviders(
      <RemoveAllScheduledEventsPopup
        open={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        activityName="New Activity"
        data-testid="remove-all-scheduled-events-popup"
        isLoading={true}
      />,
    );

    expect(screen.getByTestId('spinner')).toBeVisible();
    expect(screen.getByText('Remove')).toBeDisabled();

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCloseMock).toBeCalled();
  });
});
