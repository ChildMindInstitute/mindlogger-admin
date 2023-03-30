import { Box, styled } from '@mui/material';

import { StyledClearedButton, theme, variables } from 'shared/styles';

export const StyledContainer = styled(Box)`
  width: 44rem;
  height: 100%;
  position: absolute;
  right: 0;
  background-color: ${variables.palette.surface1};
`;

export const StyledButton = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.8)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
