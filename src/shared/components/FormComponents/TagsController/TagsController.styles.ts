import { styled, TextField } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledTextField = styled(TextField)`
  .MuiChip-root {
    margin-top: 0;
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
