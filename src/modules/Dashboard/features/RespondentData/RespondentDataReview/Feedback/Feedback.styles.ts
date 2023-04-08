import { styled } from '@mui/material';

import { StyledClearedButton, StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledContainer = styled(StyledFlexColumn)`
  width: 44rem;
  height: 100%;
  position: absolute;
  right: 0;
  z-index: 2;
  background-color: ${variables.palette.surface1};
`;

export const StyledButton = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.8)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
