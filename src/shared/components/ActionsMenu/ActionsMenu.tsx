import { MouseEvent, useMemo, useState } from 'react';

import { Svg } from 'shared/components/Svg';
import { Menu, MenuUiType } from 'shared/components/Menu';

import { StyledButton } from './ActionsMenu.styles';
import { ActionsMenuProps } from './ActionsMenu.types';

export const ActionsMenu = <T = unknown,>({
  menuItems,
  'data-testid': dataTestid,
  buttonColor,
  anchorOrigin,
  transformOrigin,
}: ActionsMenuProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event?: object) => {
    (event as MouseEvent<HTMLElement>)?.stopPropagation();
    setAnchorEl(null);
  };
  const openMenu = Boolean(anchorEl);
  const hasMenuItems = useMemo(() => {
    // Hides the ActionMenu if all the actions include .isDisplayed === false
    const displayedMenuItems = menuItems.filter((item) => 'isDisplayed' in item).length;
    if (displayedMenuItems) {
      return menuItems.filter((item) => item.isDisplayed === true).length > 0;
    }

    // And keeps compatibility with items that don't have this property
    return true;
  }, [menuItems]);

  return hasMenuItems ? (
    <>
      <StyledButton
        onClick={handleMenuOpen}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        data-testid={`${dataTestid}-dots`}
        color={buttonColor}
      >
        <Svg id="dots" width={18} height={4} />
      </StyledButton>
      {openMenu && (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          onClose={handleMenuClose}
          menuItems={menuItems}
          uiType={MenuUiType.Secondary}
          data-testid={`${dataTestid}-menu`}
        />
      )}
    </>
  ) : null;
};
