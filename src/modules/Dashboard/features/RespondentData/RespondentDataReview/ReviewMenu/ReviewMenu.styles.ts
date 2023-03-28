import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledHeader = styled(Box)`
  margin: ${theme.spacing(0, 1.6)};
  padding-bottom: ${theme.spacing(3.2)};
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;
