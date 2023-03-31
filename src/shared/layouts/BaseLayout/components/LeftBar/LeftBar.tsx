import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { List } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledLabelMedium, variables } from 'shared/styles';
import { SwitchWorkspace, WorkspaceImage } from 'shared/features/SwitchWorkspace';
import { getWorkspacesApi } from 'shared/api';

import { workspaces as currentWorkspace, auth, Workspace } from 'redux/modules';
import { useAsync } from 'shared/hooks';

import { useAppDispatch } from 'redux/store';
import { links } from './LeftBar.const';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';

export const LeftBar = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const userData = auth.useData();
  const currentWorkspaceData = currentWorkspace.useData();
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const { execute } = useAsync(getWorkspacesApi, (result) => {
    const { firstName, lastName, id } = userData?.user || {};

    id &&
      setWorkspaces([
        {
          owned: true,
          ownerId: id,
          workspaceName: `${firstName} ${lastName}`,
        },
        ...(result?.data?.result || []),
      ]);
  });

  useEffect(() => {
    execute(undefined);
  }, []);

  useEffect(() => {
    workspaces.length && dispatch(currentWorkspace.actions.setCurrentWorkspace(workspaces[0]));
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
