import { Box } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';

export const StyledReminder = styled(Box)`
  display: flex;
  margin-top: ${theme.spacing(1)};
`;

export const StyledInputWrapper = styled(Box)`
  width: 26rem;
  margin-right: ${theme.spacing(2)};
`;
