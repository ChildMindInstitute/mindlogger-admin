import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledBar = styled(Box)`
  width: 40rem;
  padding: ${theme.spacing(2.8, 1.6)};
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  height: 100%;
  overflow-y: auto;
`;
