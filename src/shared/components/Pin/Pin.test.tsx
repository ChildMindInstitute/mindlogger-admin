import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Pin } from './Pin';

const testId = 'test-pin';

const mockOnClick = jest.fn();

describe('Pin component tests', () => {
  test('calls onClick event handler when clicked', async () => {
    render(<Pin onClick={mockOnClick} data-testid={testId} />);

    const pin = screen.getByTestId(testId);
    fireEvent.click(pin);
    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  test('renders correctly with isPinned set to true', async () => {
    const { getByTestId } = render(<Pin data-testid={testId} isPinned />);

    const pinButton = getByTestId(testId);
    await waitFor(() => {
      expect(pinButton).toHaveAttribute('isPinned', 'true');
    });
  });
});
