import { render, fireEvent, screen } from '@testing-library/react';

import { InsertItem } from '.';

const mockOnInsert = vi.fn();

const dataTestid = 'builder-insert-item';
const commonProps = {
  onInsert: mockOnInsert,
  'data-testid': dataTestid,
};

describe('InsertItem', () => {
  test('should not render when isVisible is false', () => {
    render(<InsertItem isVisible={false} {...commonProps} />);

    expect(screen.queryByTestId(dataTestid)).toBeNull();
  });

  test('should render correctly when isVisible is true', () => {
    render(<InsertItem isVisible={true} {...commonProps} />);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
  });

  test('should call onInsert when clicked', () => {
    render(<InsertItem isVisible={true} {...commonProps} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnInsert).toHaveBeenCalledTimes(1);
  });
});
