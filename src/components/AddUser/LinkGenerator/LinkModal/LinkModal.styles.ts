import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'styles/variables';

export const StyledButton = styled(Button)`
  background: ${variables.palette.primary};
  color: ${variables.palette.white};
`;

export const StyledModalBtn = styled(Button)`
  background: transparent;
  color: ${variables.palette.primary};
`;

export const StyledModalWrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${variables.palette.white};
  padding: 16px 16px 8px;
  min-width: 70rem;
`;

export const StyledModalText = styled(Box)`
  padding: 20px 0;
`;
