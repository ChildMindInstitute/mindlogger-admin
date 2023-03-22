import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { List } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledLabelMedium } from 'shared/styles/styledComponents';
import { SwitchWorkspace, WorkspaceImage } from 'shared/features/SwitchWorkspace';
import { variables } from 'shared/styles/variables';
import { getWorkspacesApi } from 'shared/api/api';
import { auth } from 'modules/Auth/state';
import { Workspace } from 'shared/features/SwitchWorkspace/SwitchWorkspace.types';

import { links } from './LeftBar.const';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';

export const LeftBar = () => {
  const { t } = useTranslation('app');
  const userData = auth.useData();
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    getWorkspacesApi().then(({ data }) => {
      const { firstName, lastName, id } = userData?.user || {};
      setWorkspaces([
        {
          owned: true,
          ownerId: id,
          workspaceName: `${firstName} ${lastName}`,
        },
        ...data.result,
      ]);
    });
  }, []);

  useEffect(() => {
    workspaces.length && setCurrentWorkspace(workspaces[0]);
  }, [workspaces]);

  return (
    <StyledDrawer>
      <StyledDrawerLogo onClick={() => setVisibleDrawer((prevState) => !prevState)}>
        <WorkspaceImage workspaceName={currentWorkspace?.workspaceName} />
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
