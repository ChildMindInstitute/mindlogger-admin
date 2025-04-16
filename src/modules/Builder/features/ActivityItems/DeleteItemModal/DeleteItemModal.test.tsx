import { render, fireEvent } from '@testing-library/react';

import { DeleteItemModal } from '.';

const mockOnRemoveItem = vi.fn();
const mockOnClose = vi.fn();

const props = {
  itemIdToDelete: '123',
  activeItemIndex: 0,
  onClose: mockOnClose,
  onRemoveItem: mockOnRemoveItem,
  onSetActiveItem: vi.fn(),
};

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    watch: () => vi.fn()(),
    setValue: () => vi.fn(),
  }),
}));

describe('DeleteItemModal', () => {
  test('calls onRemoveItem and onClose when the delete button is clicked', () => {
    const { getByText } = render(<DeleteItemModal {...props} />);

    const deleteButton = getByText('Delete');
    fireEvent.click(deleteButton);
    expect(mockOnRemoveItem).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should render only when itemIdToDelete is provided', () => {
    const { queryByText } = render(<DeleteItemModal {...props} itemIdToDelete="" />);

    expect(queryByText(/delete/i)).not.toBeInTheDocument();
  });
});
