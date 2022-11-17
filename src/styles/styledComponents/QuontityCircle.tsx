import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledQuantityCircle = styled(Box)`
  position: absolute;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${variables.palette.semantic.error};
`;
