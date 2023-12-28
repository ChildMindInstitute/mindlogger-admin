import { render, fireEvent, screen } from '@testing-library/react';

import { ActivitiesHeader } from '.';

describe('ActivitiesHeader - Interaction Tests', () => {
  test('calls onAddActivity when the Add Activity button is clicked', () => {
    const mockOnAddActivity = jest.fn();

    render(
      <ActivitiesHeader headerProps={{ onAddActivity: mockOnAddActivity }}>
        <></>
      </ActivitiesHeader>,
    );

    fireEvent.click(screen.getByTestId('builder-activities-add-activity'));
    expect(mockOnAddActivity).toHaveBeenCalled();
  });

  test('opens and closes the performance task menu correctly', () => {
    render(
      <ActivitiesHeader>
        <></>
      </ActivitiesHeader>,
    );

    const addPerfTaskButton = screen.getByTestId('builder-activities-add-perf-task');
    fireEvent.click(addPerfTaskButton);
    expect(screen.getByText('A/B Trails iPad')).toBeInTheDocument();
  });
});
