import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { LEFT_BAR_WIDTH } from 'consts';

export const StyledBaseLayout = styled(Box)`
  height: 100vh;
  display: flex;
`;

export const StyledCol = styled(Box)`
  width: calc(100% - ${LEFT_BAR_WIDTH});
  display: flex;
  flex-direction: column;
`;
