import { styled } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { StyledClearedButton, theme } from 'shared/styles';

export const StyledButton = styled(StyledClearedButton)`
  gap: ${theme.spacing(0.8)};
  padding: ${theme.spacing(0)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  &.MuiButton-root:hover {
    background-color: transparent;
  }
`;
