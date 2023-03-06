import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledItemOption = styled(Box, shouldForwardProp)`
  margin-bottom: ${theme.spacing(2.4)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
