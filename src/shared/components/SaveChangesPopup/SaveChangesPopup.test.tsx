import { render, screen, fireEvent } from '@testing-library/react';

import { SaveChangesPopup } from './SaveChangesPopup';

const mockOnCancel = vi.fn();
const mockOnDontSave = vi.fn();
const mockOnSave = vi.fn();

const commonProps = {
  popupVisible: true,
  onDontSave: mockOnDontSave,
  onCancel: mockOnCancel,
  onSave: mockOnSave,
  'data-testid': 'save-changes-popup',
};

describe('SaveChangesPopup', () => {
  test('closes when the cancel button is clicked', () => {
    render(<SaveChangesPopup {...commonProps} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('triggers onDontSave when the do not save button is clicked', () => {
    render(<SaveChangesPopup {...commonProps} />);

    fireEvent.click(screen.getByText("Don't Save"));
    expect(mockOnDontSave).toHaveBeenCalled();
  });

  test('triggers onSave when the save button is clicked', () => {
    render(<SaveChangesPopup {...commonProps} />);

    fireEvent.click(screen.getByTestId(`${commonProps['data-testid']}-save-button`));
    expect(mockOnSave).toHaveBeenCalled();
  });
});
