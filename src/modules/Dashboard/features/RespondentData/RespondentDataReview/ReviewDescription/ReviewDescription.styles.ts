import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledReviewDescription = styled(Box)`
  padding: ${theme.spacing(1, 0, 2.4)};
  margin: ${theme.spacing(0, 6)};
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;
