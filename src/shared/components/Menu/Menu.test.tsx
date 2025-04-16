import { render, screen, fireEvent } from '@testing-library/react';

import { MenuItemType } from './Menu.types';
import { Menu } from './Menu';

const menuItems = [
  {
    icon: <span data-testid="test-icon" />,
    title: 'Option 1',
    isDisplayed: true,
    tooltip: 'tooltip text',
    context: 'context-1',
    action: vi.fn(),
    'data-testid': 'test-menu-item-1',
  },
  {
    title: 'Option 2',
    isDisplayed: true,
    disabled: false,
    context: 'context-2',
    action: vi.fn(),
    'data-testid': 'test-menu-item-2',
  },
  {
    type: MenuItemType.Divider,
    'data-testid': 'test-menu-item-divider',
  },
  {
    title: 'Option 3',
    isDisplayed: false,
    disabled: false,
    context: 'context-3',
    action: vi.fn(),
    'data-testid': 'test-menu-item-3',
  },
  {
    title: 'Option 4',
    disabled: true,
    context: 'context-4',
    action: vi.fn(),
    'data-testid': 'test-menu-item-4',
  },
];

const renderMenu = () =>
  render(
    <Menu
      anchorEl={document.body}
      onClose={vi.fn()}
      menuItems={menuItems}
      data-testid="test-menu"
    />,
  );

describe('Menu component', () => {
  test('renders the Menu with menu items', () => {
    renderMenu();
    const menu = screen.getByTestId('test-menu');
    expect(menu).toBeInTheDocument();

    menuItems.forEach((item) => {
      const menuItem = screen.queryByTestId(item['data-testid']);
      if (item.isDisplayed === false) {
        //check correct render of not displayed items
        expect(menuItem).not.toBeInTheDocument();
      } else {
        expect(menuItem).toBeInTheDocument();
        // Compare against title only if present (dividers lack titles)
        if (item.title) {
          expect(screen.getByText(item.title)).toBeInTheDocument();
        }
      }
      if (item.disabled) {
        //check correct render of disabled items
        expect(menuItem).toHaveClass('Mui-disabled');
      }
      if (item.icon) {
        //check correct render of icon
        expect(menuItem?.querySelector('[data-testid="test-icon"]')).toBeInTheDocument();
      }
      if (item.tooltip) {
        //check correct render of tooltip
        expect(menuItem?.querySelector(`[aria-label="${item.tooltip}"]`)).toBeInTheDocument();
      }
    });
  });

  test('calls the action when a menu item is clicked', () => {
    renderMenu();
    const menuItem1 = screen.getByTestId('test-menu-item-1');
    fireEvent.click(menuItem1);
    expect(menuItems[0].action).toHaveBeenCalledWith({ title: 'Option 1', context: 'context-1' });

    const menuItem2 = screen.getByTestId('test-menu-item-2');
    fireEvent.click(menuItem2);
    expect(menuItems[1].action).toHaveBeenCalledWith({ title: 'Option 2', context: 'context-2' });
  });
});
