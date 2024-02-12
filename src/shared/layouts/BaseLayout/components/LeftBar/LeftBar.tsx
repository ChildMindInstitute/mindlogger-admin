import { useState, useEffect } from 'react';

import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { ClickAwayListener, List } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { page } from 'resources';
import { StyledLabelMedium, variables } from 'shared/styles';
import { SwitchWorkspace, WorkspaceImage } from 'shared/features/SwitchWorkspace';
import { workspaces, auth, Workspace } from 'redux/modules';
import { authStorage } from 'shared/utils/authStorage';
import { Mixpanel } from 'shared/utils/mixpanel';
import { useAppDispatch } from 'redux/store';

import { links } from './LeftBar.const';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';

export const LeftBar = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userData = auth.useData();
  const { id } = userData?.user || {};
  const { result: workspacesData } = workspaces.useWorkspacesData() || {};
  const currentWorkspaceData = workspaces.useData();
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const dataTestid = 'left-bar';

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

  useEffect(() => {
    const { workspace } = location.state ?? {};

    if (workspace) {
      authStorage.setWorkspace(workspace);
      dispatch(workspaces.actions.setCurrentWorkspace(workspace));
    }
  }, [location.state]);

  const handleLinkClick = (key: string) => {
    if (key === 'library') {
      Mixpanel.track('Browse applet library click');
    }
  };

  const handleChangeWorkspace = (workspace: Workspace) => {
    navigate(page.dashboard, { state: { workspace } });
  };

  return (
    <ClickAwayListener onClickAway={() => setVisibleDrawer(false)}>
      <StyledDrawer>
        <StyledDrawerLogo
          onClick={() => setVisibleDrawer((prevState) => !prevState)}
          data-testid={`${dataTestid}-collapse`}
        >
          <WorkspaceImage workspaceName={currentWorkspaceData?.workspaceName} />
        </StyledDrawerLogo>
        <List>
          {links.map(({ labelKey, link, icon, activeIcon }, index) => (
            <StyledDrawerItem key={labelKey} data-testid={`${dataTestid}-link-${index}`}>
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
            onChangeWorkspace={handleChangeWorkspace}
            data-testid={`${dataTestid}-workspaces-drawer`}
          />
        )}
      </StyledDrawer>
    </ClickAwayListener>
  );
};
