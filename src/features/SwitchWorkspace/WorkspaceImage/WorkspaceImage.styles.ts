import { styled } from '@mui/material';
import { StyledFlexAllCenter } from 'styles/styledComponents';
import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';

import { WorkspaceImageProps, WorkspaceUiType } from './WorkspaceImage.types';

const UiTypesStyles = {
  [WorkspaceUiType.List]: `
  height: 4rem;
  width: 4rem;
  border-radius: ${variables.borderRadius.md};
  `,
  [WorkspaceUiType.Table]: `
  height: 3.2rem;
  width: 3.2rem;
  border-radius: ${variables.borderRadius.xxs};
  `,
};

export const StyledCustomCover = styled(StyledFlexAllCenter, shouldForwardProp)`
  ${({ uiType = WorkspaceUiType.List }: Omit<WorkspaceImageProps, 'image | workspaceName'>) =>
    UiTypesStyles[uiType]};
  background-color: ${variables.palette.secondary};
  text-transform: uppercase;
`;

export const StyledImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${variables.borderRadius.md};
`;
