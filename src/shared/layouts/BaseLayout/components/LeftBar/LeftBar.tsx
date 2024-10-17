import { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { ClickAwayListener, List } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LDFlagSet } from 'launchdarkly-react-client-sdk';

import { page } from 'resources';
import { StyledLabelMedium, variables } from 'shared/styles';
import { SwitchWorkspace, WorkspaceImage } from 'shared/features/SwitchWorkspace';
import { workspaces, auth, Workspace } from 'redux/modules';
import { authStorage } from 'shared/utils/authStorage';
import { toggleBooleanState } from 'shared/utils/toggleBooleanState';
import { Mixpanel } from 'shared/utils/mixpanel';
import { useAppDispatch } from 'redux/store';
import { LocationStateKeys } from 'shared/types';
import { FeatureFlags } from 'shared/utils/featureFlags';

import { links } from './LeftBar.const';
import { StyledDrawer, StyledDrawerItem, StyledDrawerLogo } from './LeftBar.styles';
import { getWorkspaceNames } from './LeftBar.utils';

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
  const [areFeatureFlagsLoaded, setAreFeatureFlagsLoaded] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<LDFlagSet>();
  const dataTestid = 'left-bar';

  const handleLinkClick = (key: string) => {
    if (key === 'library') {
      Mixpanel.track('Browse applet library click');
    }
  };

  const handleChangeWorkspace = (workspace: Workspace) => {
    navigate(page.dashboard, { state: { [LocationStateKeys.Workspace]: workspace } });
  };

  const fetchFeatureFlags = async (workspaceNames: string[], ownerId: string) => {
    try {
      setAreFeatureFlagsLoaded(false);
      setFeatureFlags(undefined);

      const featureFlags = await FeatureFlags.updateWorkspaces(workspaceNames, ownerId);

      setFeatureFlags(featureFlags);
    } finally {
      setAreFeatureFlagsLoaded(true);
    }
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { getWorkspaces } = workspaces.thunk;
      const workspacesResult = await dispatch(getWorkspaces());

      if (getWorkspaces.fulfilled.match(workspacesResult)) {
        const {
          payload: { data },
        } = workspacesResult;

        const ownerWorkspace = (data?.result as Workspace[])?.find((item) => item.ownerId === id);
        const storageWorkspace = authStorage.getWorkspace();
        const currentWorkspace = storageWorkspace || ownerWorkspace;
        dispatch(workspaces.actions.setCurrentWorkspace(currentWorkspace || null));

        if (!currentWorkspace?.ownerId) return;

        const workspaceNames = getWorkspaceNames(data.result);

        await fetchFeatureFlags(workspaceNames, currentWorkspace.ownerId);
      }
    };

    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { workspace } = location.state ?? {};

    if (!workspace || !dispatch) return;

    authStorage.setWorkspace(workspace);
    dispatch(workspaces.actions.setCurrentWorkspace(workspace));

    if (!workspace?.ownerId || !workspacesData) return;

    fetchFeatureFlags(getWorkspaceNames(workspacesData), workspace.ownerId);
  }, [location.state, workspacesData, dispatch]);

  return (
    <ClickAwayListener onClickAway={() => setVisibleDrawer(false)}>
      <StyledDrawer>
        <StyledDrawerLogo
          onClick={toggleBooleanState(setVisibleDrawer)}
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
