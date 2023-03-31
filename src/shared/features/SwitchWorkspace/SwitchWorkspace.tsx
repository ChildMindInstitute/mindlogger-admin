import { Fragment } from 'react';

import { Svg } from 'shared/components';
import { StyledClearedButton } from 'shared/styles/styledComponents';

import {
  StyledCloseWrapper,
  StyledDivider,
  StyledSwitchWorkspaceDrawer,
} from './SwitchWorkspace.styles';
import { SwitchWorkspaceProps } from './SwitchWorkspace.types';
import { WorkspaceGroup } from './WorkspaceGroup';
import { getWorkspacesGroups } from './SwitchWorkspace.utils';

export const SwitchWorkspace = ({
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
          <WorkspaceGroup workspacesGroup={workspacesGroup} />
        </Fragment>
      ))}
    </StyledSwitchWorkspaceDrawer>
  );
};
