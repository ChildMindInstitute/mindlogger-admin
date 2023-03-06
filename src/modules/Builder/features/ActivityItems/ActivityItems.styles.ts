import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';

export const StyledWrapper = styled(Box)`
  display: flex;
  height: calc(100% + 4rem);
  overflow-y: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
`;
