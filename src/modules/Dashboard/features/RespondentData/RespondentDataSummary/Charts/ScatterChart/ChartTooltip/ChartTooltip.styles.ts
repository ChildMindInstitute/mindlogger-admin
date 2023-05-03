import { Box, Button, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTooltip = styled(Box)`
  position: absolute;
  opacity: 1;
  transform: translate(-50%, 0);
  z-index: ${theme.zIndex.fab};
  background-color: ${variables.palette.surface2};
  border-radius: ${variables.borderRadius.lg};
  padding: ${theme.spacing(1.6, 2)};
`;

export const StyledButton = styled(Button)`
  padding-left: 0;
  color: ${variables.palette.on_surface};
  font-size: ${variables.font.size.lg};
`;
