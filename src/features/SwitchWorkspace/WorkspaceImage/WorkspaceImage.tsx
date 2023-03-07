import { StyledTitleBoldSmall } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';

import { StyledCustomCover, StyledImage } from './WorkspaceImage.styles';
import { WorkspaceImageProps, WorkspaceUiType } from './WorkspaceImage.types';

export const WorkspaceImage = ({
  uiType = WorkspaceUiType.List,
  image = '',
  workspaceName = '',
}: WorkspaceImageProps) => (
  <StyledCustomCover uiType={uiType}>
    {image ? (
      <StyledImage src={image} />
    ) : (
      <StyledTitleBoldSmall color={variables.palette.white}>
        {workspaceName.slice(0, 2)}
      </StyledTitleBoldSmall>
    )}
  </StyledCustomCover>
);
