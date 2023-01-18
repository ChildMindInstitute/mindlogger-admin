import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg, Menu } from 'components';

import { StyledButton } from './ButtonWithMenu.styles';
import { ButtonWithMenuProps } from './ButtonWithMenu.types';

export const ButtonWithMenu = ({
  menuItems,
  anchorEl,
  setAnchorEl,
  label,
  startIcon,
  variant,
}: ButtonWithMenuProps) => {
  const { t } = useTranslation('app');
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const openMenu = Boolean(anchorEl);

  return (
    <>
      <StyledButton
        variant={variant}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        startIcon={startIcon || <Svg id="add" width="18" height="18" />}
        endIcon={<Svg id={openMenu ? 'navigate-up' : 'navigate-down'} width="18" height="18" />}
        onClick={handleMenuOpen}
      >
        {t(label)}
      </StyledButton>
      <Menu anchorEl={anchorEl} onClose={handleMenuClose} menuItems={menuItems} />
    </>
  );
};
