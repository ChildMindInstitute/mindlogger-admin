import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';

export const StyledBaseLayout = styled(Box)`
  height: 100vh;
  margin-left: ${theme.spacing(8.8)};
  padding-top: ${theme.spacing(6.8)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
