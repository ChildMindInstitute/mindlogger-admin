import { render, screen, fireEvent } from '@testing-library/react';

import { DeleteActivityModal } from '.';

const mockOnModalClose = vi.fn();
const mockOnModalSubmit = vi.fn();
const activityName = 'Sample Activity';

const renderComponent = () =>
  render(
    <DeleteActivityModal
      onModalSubmit={mockOnModalSubmit}
      onModalClose={mockOnModalClose}
      isOpen={true}
      activityName={activityName}
    />,
  );

describe('DeleteActivityModal', () => {
  test('renders and displays the activity name', () => {
    renderComponent();
    expect(screen.getByText(activityName)).toBeInTheDocument();
  });

  test('calls onModalSubmit when the delete button is clicked', () => {
    renderComponent();

    const deleteButton = screen.getByText('Delete'); // Assuming 'delete' is the text on your delete button
    fireEvent.click(deleteButton);
    expect(mockOnModalSubmit).toHaveBeenCalled();
  });

  test('calls onModalClose when the cancel button is clicked', () => {
    renderComponent();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnModalClose).toHaveBeenCalled();
  });
});
