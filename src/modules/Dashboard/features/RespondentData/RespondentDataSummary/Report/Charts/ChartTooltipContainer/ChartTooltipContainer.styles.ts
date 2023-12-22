import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledTooltip = styled(Box)`
  position: absolute;
  display: none;
  transform: translate(-50%, 0);
  z-index: ${theme.zIndex.fab};
`;
