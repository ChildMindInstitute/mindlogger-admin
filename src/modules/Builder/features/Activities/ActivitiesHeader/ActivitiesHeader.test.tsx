import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import { ActivitiesHeader } from '.';

describe('ActivitiesHeader - Interaction Tests', () => {
  test('calls onAddActivity when the Add Activity button is clicked', () => {
    const mockOnAddActivity = vi.fn();

    render(
      <ActivitiesHeader headerProps={{ onAddActivity: mockOnAddActivity }}>
        <></>
      </ActivitiesHeader>,
    );

    fireEvent.click(screen.getByTestId('builder-activities-add-activity'));
    expect(mockOnAddActivity).toHaveBeenCalled();
  });

  test('opens and closes the performance task menu correctly', async () => {
    render(
      <ActivitiesHeader>
        <></>
      </ActivitiesHeader>,
    );

    const addPerfTaskButton = screen.getByTestId('builder-activities-add-perf-task');
    fireEvent.click(addPerfTaskButton);
    const menu = [
      'A/B Trails iPad',
      'A/B Trails Mobile',
      'Simple & Choice Reaction Time Task Builder',
      'CST Gyroscope',
      'CST Touch',
    ];
    const menuItem = screen.getByText(menu[0]);
    menu.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    fireEvent.click(menuItem);
    await waitFor(() => {
      expect(menuItem).not.toBeInTheDocument();
    });
  });
});
