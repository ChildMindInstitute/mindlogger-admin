import { styled, Box } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledChartContainer = styled(Box)`
  margin: ${theme.spacing(2.4, 0)};
  height: 48rem;
`;

export const StyledTooltipWrapper = styled(Box)`
  position: absolute;
  display: none;
  transform: translate(-50%, 0);
  z-index: ${theme.zIndex.fab};
`;

export const StyledIndent = styled(Box)`
  opacity: 0;
  width: 100%;
  height: 0.2rem;
  pointer-events: none;
`;
