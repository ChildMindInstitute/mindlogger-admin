import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledInputWrapper = styled(Box)`
  margin-bottom: ${theme.spacing(2.4)};
  padding: ${theme.spacing(0, 2.4)};

  .MuiOutlinedInput-root {
    border-radius: ${variables.borderRadius.xs};
  }
`;
