import { styled } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledBorderedOverflow = styled('div')({
  overflowY: 'auto',
  boxShadow: `inset 0 ${variables.borderWidth.md} ${variables.palette.surface_variant},
              inset 0 -${variables.borderWidth.md} ${variables.palette.surface_variant}`,
  '&::before, &::after': {
    content: '""',
    display: 'block',
    position: 'relative',
    minHeight: variables.borderWidth.md,
    background: variables.palette.surface,
  },
});
