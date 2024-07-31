import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledConnectionInfo = styled(Box)`
  background: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg};
  padding: ${theme.spacing(2.4)};
`;
