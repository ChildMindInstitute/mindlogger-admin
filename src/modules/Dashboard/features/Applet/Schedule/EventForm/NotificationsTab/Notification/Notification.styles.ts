import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

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

export const StyledLeftCol = styled(Box)`
  width: 40%;
  padding-top: ${theme.spacing(0.8)};
`;
