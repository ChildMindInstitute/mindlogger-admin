import { Box, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledInputWrapper = styled(Box)`
  margin-top: ${theme.spacing(2.4)};

  .MuiOutlinedInput-root {
    border-radius: ${variables.borderRadius.xs};
  }
`;
