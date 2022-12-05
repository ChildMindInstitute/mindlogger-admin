import { useTranslation } from 'react-i18next';
import { ListItemIcon, MenuItem } from '@mui/material';

import { variables } from 'styles/variables';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';

import { StyledMenu } from './Menu.styles';
import { MenuProps } from './Menu.types';

export const Menu = ({ anchorEl, onClose, menuItems, context }: MenuProps): JSX.Element => {
  const { t } = useTranslation('app');
  const open = Boolean(anchorEl);

  return (
    <StyledMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {menuItems.map(({ icon, title, action }, i) => (
        <MenuItem key={i} onClick={() => action(context)}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <StyledBodyLarge color={variables.palette.on_surface} letterSpacing="xxl">
            {t(title)}
          </StyledBodyLarge>
        </MenuItem>
      ))}
    </StyledMenu>
  );
};
