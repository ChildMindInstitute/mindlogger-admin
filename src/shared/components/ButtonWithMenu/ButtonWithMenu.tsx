import { MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';

import { Menu } from 'shared/components/Menu';
import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';
import { variables } from 'shared/styles';

import { StyledButton } from './ButtonWithMenu.styles';
import { ButtonWithMenuProps } from './ButtonWithMenu.types';

export const ButtonWithMenu = ({
  menuItems,
  anchorEl,
  setAnchorEl,
  label,
  startIcon,
  variant,
  disabled = false,
  menuListWidth,
  menuProps,
  'data-testid': dataTestid,
  tooltip,
}: ButtonWithMenuProps) => {
  const { t } = useTranslation('app');
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const openMenu = Boolean(anchorEl);

  return (
    <>
      <Tooltip tooltipTitle={tooltip || null}>
        <span>
          <StyledButton
            sx={{
              backgroundColor: openMenu && variant === 'outlined' ? variables.palette.primary_alfa12 : 'inherit',
            }}
            disabled={disabled}
            variant={variant}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            startIcon={startIcon || <Svg id="add" width="18" height="18" />}
            endIcon={<Svg id={openMenu ? 'navigate-up' : 'navigate-down'} width="18" height="18" />}
            onClick={handleMenuOpen}
            data-testid={dataTestid}
          >
            {t(label)}
          </StyledButton>
        </span>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        menuItems={menuItems}
        width={menuListWidth}
        uiType={menuProps?.uiType}
      />
    </>
  );
};
