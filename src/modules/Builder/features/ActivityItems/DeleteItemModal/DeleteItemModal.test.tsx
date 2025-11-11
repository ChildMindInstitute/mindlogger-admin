import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

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

vi.mock('react-hook-form', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-hook-form')>('react-hook-form');

  return {
    ...actual,
    useFormContext: () => ({
      watch: (path: string | undefined) => {
        // Return an array for any path that ends with '.items'
        if (path && path.endsWith('.items')) {
          return [];
        }
        // Return empty arrays for other watched paths
        if (
          path &&
          (path.includes('subscales') || path.includes('reports') || path === 'activityFlows')
        ) {
          return [];
        }

        return undefined;
      },
      setValue: () => vi.fn(),
      trigger: () => vi.fn(),
    }),
  };
});

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
