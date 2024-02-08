import { Fragment } from 'react';

import { auth } from 'redux/modules';
import { Svg } from 'shared/components/Svg';
import { StyledIconButton } from 'shared/styles';

import { StyledCloseWrapper, StyledDivider, StyledSwitchWorkspaceDrawer } from './SwitchWorkspace.styles';
import { SwitchWorkspaceProps } from './SwitchWorkspace.types';
import { getWorkspacesGroups } from './SwitchWorkspace.utils';
import { WorkspaceGroup } from './WorkspaceGroup';

export const SwitchWorkspace = ({
  setVisibleDrawer,
  visibleDrawer,
  workspaces,
  onChangeWorkspace,
  'data-testid': dataTestid,
}: SwitchWorkspaceProps) => {
  const userData = auth.useData();
  const { id } = userData?.user || {};
  const workspacesGroups = getWorkspacesGroups(workspaces, id);

  return (
    <StyledSwitchWorkspaceDrawer anchor="left" open={visibleDrawer} hideBackdrop data-testid={dataTestid}>
      <StyledCloseWrapper>
        <StyledIconButton onClick={() => setVisibleDrawer(false)} data-testid={`${dataTestid}-close`}>
          <Svg id="close" />
        </StyledIconButton>
      </StyledCloseWrapper>
      {workspacesGroups.map((workspacesGroup, index) => (
        <Fragment key={workspacesGroup.groupName}>
          {!!index && <StyledDivider />}
          <WorkspaceGroup
            workspacesGroup={workspacesGroup}
            onChangeWorkspace={onChangeWorkspace}
            data-testid={`${dataTestid}-workspace-group-${index}`}
          />
        </Fragment>
      ))}
    </StyledSwitchWorkspaceDrawer>
  );
};
