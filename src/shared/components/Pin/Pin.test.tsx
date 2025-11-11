import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Pin } from './Pin';

const testId = 'test-pin';

const mockOnClick = vi.fn();

describe('Pin', () => {
  test('calls onClick event handler when clicked', async () => {
    render(<Pin onClick={mockOnClick} data-testid={testId} />);

    const pin = screen.getByTestId(testId);
    fireEvent.click(pin);
    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalled();
    });
  });
});
