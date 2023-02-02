import { styled, Box } from '@mui/material';

import { variables } from 'styles/variables';
import theme from 'styles/theme';

export const StyledYear = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding-top: ${theme.spacing(2.6)};
`;
