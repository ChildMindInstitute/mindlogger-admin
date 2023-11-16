import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTooltip = styled(Box)`
  max-width: 20rem;
  position: absolute;
  display: none;
  transform: translate(-50%, -100%);
  z-index: ${theme.zIndex.fab};
  background-color: ${variables.palette.on_surface};
  border-radius: ${variables.borderRadius.xs};
`;

export const StyledBackground = styled(Box)`
  flex-shrink: 0;
  width: 1.2rem;
  height: 1.2rem;
`;
