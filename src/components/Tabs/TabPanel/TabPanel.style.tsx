import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { variables } from 'styles/variables';
import theme from 'styles/theme';

export const StyledPanel = styled(Box)`
  background: ${variables.palette.surface};
  padding: ${theme.spacing(2.4, 2.4, 1.6)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;
