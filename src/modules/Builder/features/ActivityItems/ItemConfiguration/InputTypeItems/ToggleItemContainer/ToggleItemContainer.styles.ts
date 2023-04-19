import { styled } from '@mui/material';

import { shouldForwardProp } from 'shared/utils';
import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

import { StyledItemOptionContainer } from '../ItemOptionContainer';

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
