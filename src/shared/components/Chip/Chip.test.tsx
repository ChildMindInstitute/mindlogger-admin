import { render, screen, fireEvent } from '@testing-library/react';

import { Chip } from './Chip';

describe('Chip', () => {
  test('handles click event', () => {
    const handleClick = vi.fn();
    render(<Chip title="Clickable Chip" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Clickable Chip'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('remove button click calls onRemove', () => {
    const handleRemove = vi.fn();
    render(<Chip title="Removable Chip" data-testid="chip" onRemove={handleRemove} canRemove />);

    fireEvent.click(screen.getByTestId('chip-close-button'));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});
