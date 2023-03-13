import { styled, Box } from '@mui/material';

import { variables, theme } from 'shared/styles';

export const StyledGeolocation = styled(Box)`
  background-color: ${variables.palette.surface1};
  padding: ${theme.spacing(1.6, 2.4)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2.4)};
`;
