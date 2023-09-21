import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { List } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledBodyLarge, StyledBodyMedium, theme, variables } from 'shared/styles';
import { useAppDispatch } from 'redux/store';
import { workspaces as currentWorkspace, Workspace } from 'redux/modules';
import { authStorage } from 'shared/utils/authStorage';
import { page } from 'resources';

import { WorkspaceImage } from '../WorkspaceImage';
import {
  StyledListItemButton,
  StyledItemContent,
  StyledSelect,
  StyledItemName,
} from './WorkspaceGroup.styles';
import { WorkspaceGroupProps } from './WorkspaceGroup.types';

export const WorkspaceGroup = ({
  workspacesGroup: { groupName, workspaces, emptyState = '' },
  'data-testid': dataTestid,
}: WorkspaceGroupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentWorkspaceData = currentWorkspace.useData();

  const changeWorkspaceHandler = (workspace: Workspace) => {
    authStorage.setWorkspace(workspace);
    dispatch(currentWorkspace.actions.setCurrentWorkspace(workspace));
    navigate(page.dashboard);
  };

  return (
    <List sx={{ padding: theme.spacing(0) }}>
      <StyledBodyMedium sx={{ padding: theme.spacing(1.6), color: variables.palette.outline }}>
        {t(groupName)}
      </StyledBodyMedium>
      {workspaces.length ? (
        workspaces.map((workspace, index) => (
          <StyledListItemButton
            key={workspace.ownerId}
            onClick={() => changeWorkspaceHandler(workspace)}
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
        <StyledBodyLarge
          sx={{ margin: theme.spacing(0, 2.4), color: variables.palette.on_surface_variant }}
        >
          {t(emptyState)}
        </StyledBodyLarge>
      )}
    </List>
  );
};
