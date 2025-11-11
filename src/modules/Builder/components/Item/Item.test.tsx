import { render, fireEvent, screen } from '@testing-library/react';

import { Item } from '.';

const dataTestId = 'builder-item';
const actionDataTestId = 'action-1';
const defaultProps = {
  name: 'Test Item',
  description: 'Description',
  img: 'test.jpg',
  count: 5,
  index: 1,
  total: 10,
  getActions: () => [
    {
      icon: <></>,
      action: vi.fn(),
      tooltipTitle: 'Action 1',
      'data-testid': actionDataTestId,
    },
  ],
};

describe('Item', () => {
  test('shows Actions based on visibleByDefault prop', () => {
    render(<Item {...defaultProps} visibleByDefault={true} />);

    expect(screen.getByTestId(actionDataTestId)).toBeInTheDocument();
  });

  test('toggles Actions visibility on mouse events', async () => {
    render(<Item {...defaultProps} />);

    const item = screen.getByTestId(dataTestId);
    const button = screen.getByTestId(actionDataTestId);

    fireEvent.mouseEnter(item);
    expect(button).toBeInTheDocument();

    fireEvent.mouseLeave(item);
    expect(button).toHaveStyle('opacity: 0');
    expect(button).toHaveStyle('width: 0');
  });

  test('calls onItemClick on click', () => {
    const mockOnItemClick = vi.fn();

    render(<Item {...defaultProps} onItemClick={mockOnItemClick} />);

    fireEvent.click(screen.getByTestId(dataTestId));
    expect(mockOnItemClick).toHaveBeenCalled();
  });
});
