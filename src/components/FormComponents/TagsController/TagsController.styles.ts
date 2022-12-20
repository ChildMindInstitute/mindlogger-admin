import { styled, TextField } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledTextField = styled(TextField)`
  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
