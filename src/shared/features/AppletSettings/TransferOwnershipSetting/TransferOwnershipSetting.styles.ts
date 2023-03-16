import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'shared/styles';
import theme from 'shared/styles/theme';

export const StyledTransferOwnershipForm = styled(Box)`
  margin: ${theme.spacing(4.8, 0, 2.4)};
  max-width: 54.6rem;

  .MuiTypography-root {
    color: ${variables.palette.on_surface_variant};
  }
`;
