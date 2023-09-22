import { useTranslation } from 'react-i18next';
import { ListItemIcon, MenuItem } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { StyledBodyLarge } from 'shared/styles/styledComponents';

import { StyledMenu } from './Menu.styles';
import { MenuProps } from './Menu.types';
import { MenuUiType } from './Menu.const';

export const Menu = ({
  anchorEl,
  onClose,
  menuItems,
  anchorOrigin,
  transformOrigin,
  width = 'auto',
  uiType = MenuUiType.Primary,
}: MenuProps) => {
  const { t } = useTranslation('app');
  const open = Boolean(anchorEl);

  return (
    <StyledMenu
      MenuListProps={{
        sx: { width },
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={
        anchorOrigin || {
          vertical: 'bottom',
          horizontal: 'left',
        }
      }
      transformOrigin={
        transformOrigin || {
          vertical: 'top',
          horizontal: 'left',
        }
      }
      uiType={uiType}
    >
      {menuItems.map(({ icon, title, action, 'data-testid': dataTestId }, i) => (
        <MenuItem key={i} onClick={() => action(title)} data-testid={dataTestId}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <StyledBodyLarge color={variables.palette.on_surface} letterSpacing="xxl">
            {t(title)}
          </StyledBodyLarge>
        </MenuItem>
      ))}
    </StyledMenu>
  );
};
