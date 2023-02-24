import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { List } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledLabelMedium } from 'styles/styledComponents';
import { SwitchWorkspace, WorkspaceImage } from 'features/SwitchWorkspace';
import { variables } from 'styles/variables';

import { links } from './LeftBar.const';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';
import { mockedWorkspaces as workspaces } from './mocked';

export const LeftBar = () => {
  const { t } = useTranslation('app');

  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0]);
  // TODO: get list of available workspaces and set the current one

  return (
    <StyledDrawer>
      <StyledDrawerLogo onClick={() => setVisibleDrawer((prevState) => !prevState)}>
        <WorkspaceImage workspaceName={currentWorkspace.accountName} />
      </StyledDrawerLogo>
      <List>
        {links.map(({ labelKey, link, icon, activeIcon }) => (
          <StyledDrawerItem key={labelKey}>
            <NavLink to={link} className={({ isActive }) => (isActive ? 'active-link' : undefined)}>
              {({ isActive }) => (
                <>
                  {isActive ? activeIcon : icon}
                  <StyledLabelMedium color={variables.palette.on_surface_variant}>
                    {t(labelKey)}
                  </StyledLabelMedium>
                </>
              )}
            </NavLink>
          </StyledDrawerItem>
        ))}
      </List>
      {visibleDrawer && (
        <SwitchWorkspace
          currentWorkspace={currentWorkspace}
          setCurrentWorkspace={setCurrentWorkspace}
          setVisibleDrawer={setVisibleDrawer}
          visibleDrawer={visibleDrawer}
          workspaces={workspaces}
        />
      )}
    </StyledDrawer>
  );
};
