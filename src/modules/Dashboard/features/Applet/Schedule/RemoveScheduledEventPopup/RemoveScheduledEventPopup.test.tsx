import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { RemoveScheduledEventPopup } from './RemoveScheduledEventPopup';

const onCloseMock = jest.fn();
const onSubmitMock = jest.fn();

describe('RemoveScheduledEventPopup', () => {
  test('should render and submit', () => {
    renderWithProviders(
      <RemoveScheduledEventPopup
        open={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        activityName="New Activity"
        data-testid="remove-scheduled-events-popup"
        isLoading={false}
      />,
    );

    const popup = screen.getByTestId('remove-scheduled-events-popup');
    expect(popup).toBeVisible();
    expect(popup).toHaveTextContent('Are you sure you want to remove this scheduled event for New Activity?');

    fireEvent.click(screen.getByText('Remove'));

    expect(onSubmitMock).toBeCalled();
  });

  test('should show spinner and disable submit button when isLoading true', () => {
    renderWithProviders(
      <RemoveScheduledEventPopup
        open={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        activityName="New Activity"
        isLoading={true}
      />,
    );

    expect(screen.getByTestId('spinner')).toBeVisible();
    expect(screen.getByText('Remove')).toBeDisabled();

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCloseMock).toBeCalled();
  });
});
