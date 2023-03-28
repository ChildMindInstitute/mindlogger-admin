import { useTranslation } from 'react-i18next';
import { List } from '@mui/material';

import { DEFAULT_ROWS_PER_PAGE, Svg } from 'shared/components';
import { StyledBodyLarge, StyledBodyMedium, theme, variables } from 'shared/styles';
import { useAppDispatch } from 'redux/store';
import { applets } from 'redux/modules';

import { WorkspaceImage } from '../WorkspaceImage';
import { StyledListItemButton, StyledItemContent, StyledSelect } from './WorkspaceGroup.styles';
import { WorkspaceGroupProps } from './WorkspaceGroup.types';
import { Workspace } from '../SwitchWorkspace.types';

export const WorkspaceGroup = ({
  workspacesGroup: { groupName, workspaces, emptyState = '' },
  currentWorkspace,
  setCurrentWorkspace,
}: WorkspaceGroupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const changeWorkspaceHandler = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    const { getWorkspaceApplets } = applets.thunk;
    dispatch(
      getWorkspaceApplets({
        params: {
          ownerId: workspace.ownerId,
          limit: DEFAULT_ROWS_PER_PAGE,
          ordering: '-desc',
        },
      }),
    );
  };

  return (
    <List sx={{ padding: theme.spacing(0) }}>
      <StyledBodyMedium sx={{ padding: theme.spacing(1.6), color: variables.palette.outline }}>
        {t(groupName)}
      </StyledBodyMedium>
      {workspaces.length ? (
        workspaces.map((workspace) => (
          <StyledListItemButton
            key={workspace.ownerId}
            onClick={() => changeWorkspaceHandler(workspace)}
            selected={currentWorkspace?.ownerId === workspace.ownerId}
          >
            <StyledItemContent>
              <WorkspaceImage image={workspace?.image} workspaceName={workspace.workspaceName} />
              <StyledBodyLarge
                sx={{ marginLeft: theme.spacing(1.6), color: variables.palette.on_surface }}
              >
                {workspace.workspaceName}
              </StyledBodyLarge>
            </StyledItemContent>
            {currentWorkspace?.ownerId === workspace.ownerId && (
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
