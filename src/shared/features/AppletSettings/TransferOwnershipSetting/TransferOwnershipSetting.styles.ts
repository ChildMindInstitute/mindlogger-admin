import { styled, Box } from '@mui/material';

import { variables, theme } from 'shared/styles';

export const StyledTransferOwnershipForm = styled(Box)`
  margin: ${theme.spacing(4.8, 0, 2.4)};
  max-width: 54.6rem;

  .MuiTypography-root {
    color: ${variables.palette.on_surface_variant};
  }
`;
