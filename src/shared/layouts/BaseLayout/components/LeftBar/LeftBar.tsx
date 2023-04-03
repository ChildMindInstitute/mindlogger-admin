import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { List } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledLabelMedium, variables } from 'shared/styles';
import { SwitchWorkspace, WorkspaceImage } from 'shared/features/SwitchWorkspace';
import { getWorkspacesApi } from 'shared/api';
import { workspaces as currentWorkspace, Workspace, auth } from 'redux/modules';
import { useAsync } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';

import { links } from './LeftBar.const';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';

export const LeftBar = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const userData = auth.useData();
  const { id } = userData?.user || {};
  const currentWorkspaceData = currentWorkspace.useData();
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const { execute } = useAsync(getWorkspacesApi, (result) => {
    setWorkspaces(result?.data?.result || []);
  });

  useEffect(() => {
    execute(undefined);
  }, []);

  useEffect(() => {
    if (workspaces.length) {
      const ownerWorkspace = workspaces.find((item) => item.ownerId === id);
      ownerWorkspace && dispatch(currentWorkspace.actions.setCurrentWorkspace(ownerWorkspace));
    }
  }, [workspaces]);

  return (
    <StyledDrawer>
      <StyledDrawerLogo onClick={() => setVisibleDrawer((prevState) => !prevState)}>
        <WorkspaceImage workspaceName={currentWorkspaceData?.workspaceName} />
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
          setVisibleDrawer={setVisibleDrawer}
          visibleDrawer={visibleDrawer}
          workspaces={workspaces}
        />
      )}
    </StyledDrawer>
  );
};
