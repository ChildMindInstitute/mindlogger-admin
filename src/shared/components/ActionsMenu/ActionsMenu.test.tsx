import { render, screen, fireEvent } from '@testing-library/react';

import { ActionsMenu } from './ActionsMenu';

const menuItems = [
  { title: 'Option 1', action: jest.fn() },
  { title: 'Option 2', action: jest.fn() },
];

const renderMenu = () => render(<ActionsMenu menuItems={menuItems} data-testid="test-actions" />);
const clickOpenMenuButton = () => {
  const button = screen.getByTestId('test-actions-dots');
  fireEvent.click(button);
};

describe('ActionsMenu component', () => {
  test('renders the ActionsMenu button', () => {
    renderMenu();
    const button = screen.getByTestId('test-actions-dots');
    expect(button).toBeInTheDocument();
  });

  test('does not render the Menu initially', () => {
    renderMenu();
    const menu = screen.queryByTestId('test-actions-menu');
    expect(menu).not.toBeInTheDocument();
  });

  test('opens the Menu when clicking the button', async () => {
    renderMenu();
    clickOpenMenuButton();

    const menu = screen.getByTestId('test-actions-menu');
    expect(menu).toBeInTheDocument();
  });

  test('calls the onClick handler when a menu item is clicked', () => {
    renderMenu();
    clickOpenMenuButton();

    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);

    expect(menuItems[0].action).toHaveBeenCalled();
    expect(screen.queryByTestId('test-actions-menu')).not.toBeInTheDocument();
  });
});
