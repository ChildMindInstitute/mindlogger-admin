import { NavLink } from 'react-router-dom';
import { List } from '@mui/material';

import { Icon } from 'components/Icon';
import { StyledLabelMedium } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';
import { page } from 'resources';

import { links } from './links';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';

export const LeftBar = () => (
  <StyledDrawer variant="permanent" anchor="left" classes={{ paper: 'drawer-paper' }}>
    <StyledDrawerLogo>
      <NavLink to={page.dashboard}>
        <Icon.Workspace />
      </NavLink>
    </StyledDrawerLogo>
    <List>
      {links.map(({ text, link, icon }) => (
        <StyledDrawerItem key={text}>
          <NavLink to={link} className={({ isActive }) => (isActive ? 'active-link' : undefined)}>
            {icon}
            <StyledLabelMedium color={variables.palette.on_surface_variant}>
              {' '}
              {text}
            </StyledLabelMedium>
          </NavLink>
        </StyledDrawerItem>
      ))}
    </List>
  </StyledDrawer>
);
