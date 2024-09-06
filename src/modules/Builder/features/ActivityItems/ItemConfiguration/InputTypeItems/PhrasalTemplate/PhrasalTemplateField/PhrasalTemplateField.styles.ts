import { Box, styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledFlexTopCenterDraggable = styled(StyledFlexTopCenter)`
  ${({ isDragging }: { isDragging: boolean }) => `
  box-shadow: ${isDragging ? variables.boxShadow.light3 : 'inherit'};
  ${isDragging && `background-color: ${variables.palette.surface}`};
`};
`;

export const StyledLineBreak = styled(Box)({
  borderTop: `1px dashed ${variables.palette.outline_variant2}`,
  width: '100%',
  margin: theme.spacing(0, 1.6),
});
