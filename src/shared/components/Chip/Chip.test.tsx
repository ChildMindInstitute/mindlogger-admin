import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Chip } from './Chip';

describe('Chip component tests', () => {
  test('handles click event', () => {
    const handleClick = jest.fn();
    render(<Chip title="Clickable Chip" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Clickable Chip'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('remove button click calls onRemove', () => {
    const handleRemove = jest.fn();
    render(<Chip title="Removable Chip" onRemove={handleRemove} canRemove />);
    fireEvent.click(screen.getByTestId('close-icon'));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});
