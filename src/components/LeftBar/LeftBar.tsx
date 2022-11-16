import { NavLink } from 'react-router-dom';
import { List } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledLabelMedium } from 'styles/styledComponents/Typography';
import { Svg } from 'components/Svg';
import { variables } from 'styles/variables';
import { page } from 'resources';

import { links } from './LeftBar.const';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';

export const LeftBar = () => {
  const { t } = useTranslation('app');

  return (
    <StyledDrawer>
      <StyledDrawerLogo>
        <NavLink to={page.dashboard}>
          <Svg id="workspace" width={44} height={44} />
        </NavLink>
      </StyledDrawerLogo>
      <List>
        {links.map(({ labelKey, link, icon }) => (
          <StyledDrawerItem key={labelKey}>
            <NavLink to={link} className={({ isActive }) => (isActive ? 'active-link' : undefined)}>
              {icon}
              <StyledLabelMedium color={variables.palette.on_surface_variant}>
                {t(labelKey)}
              </StyledLabelMedium>
            </NavLink>
          </StyledDrawerItem>
        ))}
      </List>
    </StyledDrawer>
  );
};
