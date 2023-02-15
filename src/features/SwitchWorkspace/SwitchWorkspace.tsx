import { Fragment } from 'react';

import { Svg } from 'components';
import { StyledClearedButton } from 'styles/styledComponents';

import {
  StyledCloseWrapper,
  StyledDivider,
  StyledSwitchWorkspaceDrawer,
} from './SwitchWorkspace.styles';
import { SwitchWorkspaceProps } from './SwitchWorkspace.types';
import { WorkspaceGroup } from './WorkspaceGroup';
import { getWorkspacesGroups } from './SwitchWorkspace.utils';

export const SwitchWorkspace = ({
  currentWorkspace,
  setCurrentWorkspace,
  setVisibleDrawer,
  visibleDrawer,
  workspaces,
}: SwitchWorkspaceProps) => {
  const workspacesGroups = getWorkspacesGroups(workspaces);

  return (
    <StyledSwitchWorkspaceDrawer anchor="left" open={visibleDrawer} hideBackdrop>
      <StyledCloseWrapper>
        <StyledClearedButton onClick={() => setVisibleDrawer(false)}>
          <Svg id="close" />
        </StyledClearedButton>
      </StyledCloseWrapper>
      {workspacesGroups.map((workspacesGroup, index) => (
        <Fragment key={workspacesGroup.groupName}>
          {!!index && <StyledDivider />}
          <WorkspaceGroup
            workspacesGroup={workspacesGroup}
            currentWorkspace={currentWorkspace}
            setCurrentWorkspace={setCurrentWorkspace}
          />
        </Fragment>
      ))}
    </StyledSwitchWorkspaceDrawer>
  );
};
