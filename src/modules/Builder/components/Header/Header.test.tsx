import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { JEST_TEST_TIMEOUT } from 'shared/consts';

import { Header } from './Header';

const mockHandleClick = vi.fn();
const mockTitle = 'Test Title';
const mockButtons = [
  { label: 'Button 1', icon: <span>Icon 1</span>, handleClick: mockHandleClick },
  { label: 'Button 2', icon: <span>Icon 2</span>, handleClick: mockHandleClick },
];

describe('Header', () => {
  test(
    'renders title and buttons',
    () => {
      renderWithProviders(<Header title={mockTitle} buttons={mockButtons} />);

      expect(screen.getByText(mockTitle)).toBeInTheDocument();

      mockButtons.forEach(({ label }) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    },
    JEST_TEST_TIMEOUT,
  );

  test(
    'calls handleClick when button is clicked',
    async () => {
      renderWithProviders(<Header title={mockTitle} buttons={mockButtons} />);

      for (const { label, handleClick } of mockButtons) {
        await userEvent.click(screen.getByText(label));
        expect(handleClick).toHaveBeenCalled();
      }
    },
    JEST_TEST_TIMEOUT,
  );
});
