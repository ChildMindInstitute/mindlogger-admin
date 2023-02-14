import { useTranslation } from 'react-i18next';
import { List } from '@mui/material';

import { Svg } from 'components';
import { StyledBodyLarge, StyledBodyMedium } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import { WorkspaceImage } from '../WorkspaceImage';
import { StyledListItemButton, StyledItemContent, StyledSelect } from './WorkspaceGroup.styles';
import { WorkspaceGroupProps } from './WorkspaceGroup.types';

export const WorkspaceGroup = ({
  workspacesGroup: { groupName, workspaces, emptyState = '' },
  currentWorkspace,
  setCurrentWorkspace,
}: WorkspaceGroupProps) => {
  const { t } = useTranslation('app');

  return (
    <List sx={{ padding: theme.spacing(0) }}>
      <StyledBodyMedium sx={{ padding: theme.spacing(1.6), color: variables.palette.outline }}>
        {t(groupName)}
      </StyledBodyMedium>
      {workspaces.length ? (
        workspaces.map((workspace) => (
          <StyledListItemButton
            key={workspace.accountId}
            onClick={() => setCurrentWorkspace(workspace)}
            selected={currentWorkspace.accountId === workspace.accountId}
          >
            <StyledItemContent>
              <WorkspaceImage image={workspace?.image} workspaceName={workspace.accountName} />
              <StyledBodyLarge
                sx={{ marginLeft: theme.spacing(1.6), color: variables.palette.on_surface }}
              >
                {workspace.accountName}
              </StyledBodyLarge>
            </StyledItemContent>

            {currentWorkspace.accountId === workspace.accountId && (
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
