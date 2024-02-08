import { StyledTitleBoldSmall, variables } from 'shared/styles';

import { StyledCustomCover, StyledImage } from './WorkspaceImage.styles';
import { WorkspaceImageProps, WorkspaceUiType } from './WorkspaceImage.types';

export const WorkspaceImage = ({
  uiType = WorkspaceUiType.List,
  image = '',
  workspaceName = '',
  coverSxProps = {},
}: WorkspaceImageProps) => (
  <StyledCustomCover data-testid="workspace-image" uiType={uiType} sx={coverSxProps}>
    {image ? (
      <StyledImage src={image} />
    ) : (
      <StyledTitleBoldSmall color={variables.palette.white}>{workspaceName.slice(0, 2)}</StyledTitleBoldSmall>
    )}
  </StyledCustomCover>
);
