import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ClickAwayListener, Divider, List } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledLabelMedium, theme, variables } from 'shared/styles';
import { SwitchWorkspace, WorkspaceImage } from 'shared/features/SwitchWorkspace';
import { workspaces, Workspace, auth } from 'redux/modules';
import { LocalStorageKeys, getIsAddAppletBtnVisible, storage } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { Svg } from 'shared/components';
import { page } from 'resources';

import { links } from './LeftBar.const';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';

export const LeftBar = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const userData = auth.useData();
  const { id } = userData?.user || {};
  const { result: workspacesData } = workspaces.useWorkspacesData() || {};
  const rolesData = workspaces.useRolesData();
  const currentWorkspaceData = workspaces.useData();
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  useEffect(() => {
    dispatch(workspaces.thunk.getWorkspaces());
  }, []);

  useEffect(() => {
    if (workspacesData?.length) {
      const ownerWorkspace = workspacesData.find((item) => item.ownerId === id);
      const storageWorkspace = storage.getItem(LocalStorageKeys.Workspace) as Workspace;
      dispatch(workspaces.actions.setCurrentWorkspace(storageWorkspace || ownerWorkspace || null));
    }
  }, [workspacesData]);

  const getClassName = (isActive: boolean, disabled?: boolean) =>
    `${isActive ? 'active-link' : ''} ${disabled ? 'disabled-link' : ''}`;

  return (
    <ClickAwayListener onClickAway={() => setVisibleDrawer(false)}>
      <StyledDrawer>
        <StyledDrawerLogo onClick={() => setVisibleDrawer((prevState) => !prevState)}>
          <WorkspaceImage workspaceName={currentWorkspaceData?.workspaceName} />
        </StyledDrawerLogo>
        <List>
          {links.map(({ labelKey, link, icon, activeIcon, disabled }) => (
            <StyledDrawerItem key={labelKey}>
              <NavLink to={link} className={({ isActive }) => getClassName(isActive, disabled)}>
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
          {getIsAddAppletBtnVisible(currentWorkspaceData, rolesData, userData?.user) && (
            <>
              <Divider
                sx={{ my: theme.spacing(2.4), borderColor: variables.palette.outline_variant }}
              />
              <StyledDrawerItem>
                <NavLink to={page.builder}>
                  <Svg id="add" />
                  <StyledLabelMedium color={variables.palette.on_surface_variant}>
                    {t('newApplet')}
                  </StyledLabelMedium>
                </NavLink>
              </StyledDrawerItem>
            </>
          )}
        </List>
        {visibleDrawer && (
          <SwitchWorkspace
            setVisibleDrawer={setVisibleDrawer}
            visibleDrawer={visibleDrawer}
            workspaces={workspacesData || []}
          />
        )}
      </StyledDrawer>
    </ClickAwayListener>
  );
};
