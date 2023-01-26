import { Box } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledNotification = styled(Box)`
  padding: ${theme.spacing(3, 3, 2.4, 1.6)};
  background-color: ${variables.palette.surface5};
  border-radius: ${variables.borderRadius.lg2};
  position: relative;
  margin: ${theme.spacing(0, 0, 1.2, 1.1)};
`;

export const StyledCol = styled(Box)`
  width: 60%;
  display: flex;
`;

export const StyledleftCol = styled(Box)`
  width: 40%;
`;
