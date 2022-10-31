import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledResetPassword = styled(Box)`
  width: 100%;
  background-color: ${variables.palette.shadesBG};
`;

export const StyledContainerWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const StyledContainer = styled(Box)`
  width: 23.5rem;
  margin: 1.5rem 0;
`;
