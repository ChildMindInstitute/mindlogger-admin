import { render, screen, fireEvent } from '@testing-library/react';

import { SaveChangesPopup } from './SaveChangesPopup';

const mockOnCancel = jest.fn();
const mockOnDontSave = jest.fn();
const mockOnSave = jest.fn();

const commonProps = {
  popupVisible: true,
  onDontSave: mockOnDontSave,
  onCancel: mockOnCancel,
  onSave: mockOnSave,
};

describe('SaveChangesPopup component tests', () => {
  test('closes when the cancel button is clicked', () => {
    render(<SaveChangesPopup {...commonProps} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('triggers onDontSave when the do not save button is clicked', () => {
    render(<SaveChangesPopup {...commonProps} />);

    fireEvent.click(screen.getByText(/dontSave/i));
    expect(mockOnDontSave).toHaveBeenCalled();
  });

  test('triggers onSave when the save button is clicked', () => {
    render(<SaveChangesPopup {...commonProps} />);

    fireEvent.click(screen.getByText('Save'));
    expect(mockOnSave).toHaveBeenCalled();
  });
});
