import { Fragment } from 'react';

import { Svg } from 'shared/components/Svg';
import { StyledIconButton } from 'shared/styles';
import { auth } from 'redux/modules';

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
  'data-testid': dataTestid,
}: SwitchWorkspaceProps) => {
  const userData = auth.useData();
  const { id } = userData?.user || {};
  const workspacesGroups = getWorkspacesGroups(workspaces, id);

  return (
    <StyledSwitchWorkspaceDrawer
      anchor="left"
      open={visibleDrawer}
      hideBackdrop
      data-testid={dataTestid}
    >
      <StyledCloseWrapper>
        <StyledIconButton
          onClick={() => setVisibleDrawer(false)}
          data-testid={`${dataTestid}-close`}
        >
          <Svg id="close" />
        </StyledIconButton>
      </StyledCloseWrapper>
      {workspacesGroups.map((workspacesGroup, index) => (
        <Fragment key={workspacesGroup.groupName}>
          {!!index && <StyledDivider />}
          <WorkspaceGroup
            workspacesGroup={workspacesGroup}
            data-testid={`${dataTestid}-workspace-group-${index}`}
          />
        </Fragment>
      ))}
    </StyledSwitchWorkspaceDrawer>
  );
};
