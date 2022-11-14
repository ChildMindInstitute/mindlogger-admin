import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { LEFT_BAR_WIDTH } from 'components/LeftBar';
import { TOP_BAR_HEIGHT } from 'components/TopBar';

export const StyledBaseLayout = styled(Box)`
  height: 100vh;
  margin-left: ${LEFT_BAR_WIDTH};
  padding-top: ${TOP_BAR_HEIGHT};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
