import { Box, styled } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledInputWrapper = styled(Box)`
  margin-top: ${theme.spacing(2.4)};

  .MuiOutlinedInput-root {
    border-radius: ${variables.borderRadius.xxs};
  }
`;
