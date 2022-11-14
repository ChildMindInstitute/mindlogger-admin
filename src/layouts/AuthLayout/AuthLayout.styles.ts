import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledAuthLayout = styled(Box)`
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const StyledHeader = styled(Box)`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${variables.palette.primary};
  padding: ${theme.spacing(1, 2.4)};
  z-index: 2;
`;

export const StyledOutlet = styled(Box)`
  display: flex;
  flex: 1;
`;
