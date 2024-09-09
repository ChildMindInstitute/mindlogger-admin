import { Box, styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledFlexTopCenterDraggable = styled(StyledFlexTopCenter)(
  ({ isDragging }: { isDragging: boolean }) => `
  padding: ${theme.spacing(0.8)};
  margin: ${theme.spacing(-0.8)};
  ${
    isDragging
      ? `
      background-color: ${variables.palette.surface};
      border-radius: ${variables.borderRadius.md};
      box-shadow: ${variables.boxShadow.light3};`
      : ''
  }`,
);

export const StyledLineBreak = styled(Box)({
  borderTop: `1px dashed ${variables.palette.outline_variant2}`,
  width: '100%',
  margin: theme.spacing(0, 1.6),
});
