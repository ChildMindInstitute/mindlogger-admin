import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Pin } from './Pin';

const mockOnClick = jest.fn();

describe('Pin component tests', () => {
  test('clicking the close button hides the banner', async () => {
    render(<Pin onClick={mockOnClick} data-testid="test-pin" />);

    const pin = screen.getByTestId('test-pin');
    fireEvent.click(pin);
    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalled();
    });
  });
});
