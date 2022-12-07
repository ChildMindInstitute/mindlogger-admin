import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledButton = styled(Button)`
  background-color: ${variables.palette.primary};
  color: ${variables.palette.white};
`;

export const StyledModalBtn = styled(Button)`
  background-color: transparent;
  color: ${variables.palette.primary};
  text-transform: upperCase;
`;

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
