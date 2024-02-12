import { useTranslation } from 'react-i18next';
import { List } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledBodyLarge, StyledBodyMedium, theme, variables } from 'shared/styles';
import { workspaces as currentWorkspace } from 'redux/modules';

import { WorkspaceImage } from '../WorkspaceImage';
import { StyledListItemButton, StyledItemContent, StyledSelect, StyledItemName } from './WorkspaceGroup.styles';
import { WorkspaceGroupProps } from './WorkspaceGroup.types';

export const WorkspaceGroup = ({
  workspacesGroup: { groupName, workspaces, emptyState = '' },
  onChangeWorkspace,
  'data-testid': dataTestid,
}: WorkspaceGroupProps) => {
  const { t } = useTranslation('app');

  const currentWorkspaceData = currentWorkspace.useData();

  return (
    <List sx={{ padding: theme.spacing(0) }}>
      <StyledBodyMedium sx={{ padding: theme.spacing(1.6), color: variables.palette.outline }}>
        {t(groupName)}
      </StyledBodyMedium>
      {workspaces.length ? (
        workspaces.map((workspace, index) => (
          <StyledListItemButton
            key={workspace.ownerId}
            onClick={() => onChangeWorkspace(workspace)}
            selected={currentWorkspaceData?.ownerId === workspace.ownerId}
            data-testid={`${dataTestid}-workspace-${index}`}
          >
            <StyledItemContent>
              <WorkspaceImage image={workspace?.image} workspaceName={workspace.workspaceName} />
              <StyledItemName>{workspace.workspaceName}</StyledItemName>
            </StyledItemContent>
            {currentWorkspaceData?.ownerId === workspace.ownerId && (
              <StyledSelect>
                <Svg id="selected" />
              </StyledSelect>
            )}
          </StyledListItemButton>
        ))
      ) : (
        <StyledBodyLarge sx={{ margin: theme.spacing(0, 2.4), color: variables.palette.on_surface_variant }}>
          {t(emptyState)}
        </StyledBodyLarge>
      )}
    </List>
  );
};
