import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTooltip = styled(Box)`
  max-height: 20rem;
  max-width: 20rem;
  position: absolute;
  overflow-y: auto;
  display: none;
  transform: translate(-50%, 0);
  z-index: ${theme.zIndex.fab};
  background-color: ${variables.palette.on_surface};
  border-radius: ${variables.borderRadius.xs};
`;
