import { styled } from '@mui/material';

import { StyledClearedButton, StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledContainer = styled(StyledFlexColumn)`
  width: 44rem;
  height: 100%;
  background-color: ${variables.palette.surface1};
  flex-shrink: 0;

  ${theme.breakpoints.down('xl')} {
    width: 40rem;
  }
  ${theme.breakpoints.down('lg')} {
    width: 35rem;
  }
`;

export const StyledButton = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.8)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
