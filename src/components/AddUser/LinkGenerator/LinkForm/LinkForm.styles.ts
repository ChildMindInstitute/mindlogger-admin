import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'styles/variables';

export const StyledButton = styled(Button)`
  background: transparent;
  color: ${variables.palette.primary};
`;
