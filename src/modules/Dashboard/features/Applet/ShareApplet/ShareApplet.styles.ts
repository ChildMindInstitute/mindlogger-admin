import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledInputWrapper = styled(Box)`
  margin-bottom: ${theme.spacing(2.4)};
  padding: ${theme.spacing(0, 2.4)};

  .MuiOutlinedInput-root {
    border-radius: ${variables.borderRadius.xs};
  }
`;
