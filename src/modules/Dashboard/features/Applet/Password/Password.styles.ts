import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledController = styled(Box)`
  margin-bottom: ${theme.spacing(2)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${variables.palette.surface3} inset;
  }
`;
