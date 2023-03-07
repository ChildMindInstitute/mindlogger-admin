import { StyledTitleBoldSmall } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { StyledCustomCover, StyledImage } from './WorkspaceImage.styles';
import { WorkspaceImageProps } from './WorkspaceImage.types';

export const WorkspaceImage = ({ image, workspaceName = '' }: WorkspaceImageProps) => (
  <StyledCustomCover>
    {image ? (
      <StyledImage src={image} />
    ) : (
      <StyledTitleBoldSmall color={variables.palette.white}>
        {workspaceName.slice(0, 2)}
      </StyledTitleBoldSmall>
    )}
  </StyledCustomCover>
);
