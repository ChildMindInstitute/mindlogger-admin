import { styled } from '@mui/material';

import { shouldForwardProp } from 'shared/utils';
import { StyledFlexColumn, StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledItemOptionContainer = styled(StyledFlexColumn)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(3, 3, 2.1, 3)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledItemOption = styled(StyledItemOptionContainer, shouldForwardProp)`
  padding: ${theme.spacing(1.6, 2.4, 1.6, 3.4)};
  position: relative;
  width: 100%;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StylesTitleWrapper = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${({ open }: { open?: boolean }) => `
		height: ${open ? '5.6rem' : 'inherited'}; 
	`};
`;
