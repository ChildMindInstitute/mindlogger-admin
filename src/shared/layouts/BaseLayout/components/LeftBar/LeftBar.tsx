import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ClickAwayListener, List } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledLabelMedium, variables } from 'shared/styles';
import { SwitchWorkspace, WorkspaceImage } from 'shared/features/SwitchWorkspace';
import { workspaces, auth } from 'redux/modules';
import { authStorage, Mixpanel } from 'shared/utils';
import { useAppDispatch } from 'redux/store';

import { links } from './LeftBar.const';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';

export const LeftBar = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const userData = auth.useData();
  const { id } = userData?.user || {};
  const { result: workspacesData } = workspaces.useWorkspacesData() || {};
  const currentWorkspaceData = workspaces.useData();
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  useEffect(() => {
    dispatch(workspaces.thunk.getWorkspaces());
  }, []);

  useEffect(() => {
    if (workspacesData?.length) {
      const ownerWorkspace = workspacesData.find((item) => item.ownerId === id);
      const storageWorkspace = authStorage.getWorkspace();
      dispatch(workspaces.actions.setCurrentWorkspace(storageWorkspace || ownerWorkspace || null));
    }
  }, [workspacesData]);

  const handleLinkClick = (key: string) => {
    if (key === 'library') {
      Mixpanel.track('Browse applet library click');
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setVisibleDrawer(false)}>
      <StyledDrawer>
        <StyledDrawerLogo onClick={() => setVisibleDrawer((prevState) => !prevState)}>
          <WorkspaceImage workspaceName={currentWorkspaceData?.workspaceName} />
        </StyledDrawerLogo>
        <List>
          {links.map(({ labelKey, link, icon, activeIcon }) => (
            <StyledDrawerItem key={labelKey}>
              <NavLink
                onClick={() => handleLinkClick(labelKey)}
                to={link}
                className={({ isActive }) => `${isActive ? 'active-link' : ''}`}
              >
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
            workspaces={workspacesData || []}
          />
        )}
      </StyledDrawer>
    </ClickAwayListener>
  );
};
