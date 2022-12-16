import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledModalWrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${variables.palette.white};
  padding: ${theme.spacing(1.6, 1.6, 0.8)};
  min-width: 70rem;
`;

export const StyledModalText = styled(Box)`
  padding: ${theme.spacing(2, 0)};
`;

export const StyledModalBtn = styled(Button)`
  text-transform: uppercase;
`;

export const StyledInputWrapper = styled(Box)`
  margin: ${theme.spacing(2, 0)};
`;
