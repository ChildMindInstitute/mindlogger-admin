import { useTranslation } from 'react-i18next';

import { ListItemIcon, MenuItem } from '@mui/material';
import { Svg } from 'components/Svg';
import { StyledTitleSmall } from 'styles/styledComponents/Typography';

import { StyledDotsBtn, StyledMenu, StyledTitle } from './Menu.styles';
import { MenuProps } from './Menu.types';

export const Menu = ({ title, anchorEl, onClose, menuItems, context }: MenuProps): JSX.Element => {
  const { t } = useTranslation('app');
  const open = Boolean(anchorEl);

  return (
    <StyledMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <StyledDotsBtn variant="text" onClick={onClose}>
        <Svg id="dots" width={14} height={4} />
      </StyledDotsBtn>
      {title && <StyledTitle>{title}</StyledTitle>}
      {menuItems.map(({ icon, title, action }, i) => (
        <MenuItem key={i} onClick={() => action(context)}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <StyledTitleSmall>{t(title)}</StyledTitleSmall>
        </MenuItem>
      ))}
    </StyledMenu>
  );
};
