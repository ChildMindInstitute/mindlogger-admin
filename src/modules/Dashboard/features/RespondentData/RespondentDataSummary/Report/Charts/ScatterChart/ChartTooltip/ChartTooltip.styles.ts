import { Box, ListItemButton, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTooltip = styled(Box)`
  max-width: 20rem;
  min-width: 18rem;
  position: absolute;
  display: none;
  transform: translate(-50%, 0);
  z-index: ${theme.zIndex.fab};
  background-color: ${variables.palette.surface2};
  border-radius: ${variables.borderRadius.lg};
  box-shadow: ${variables.boxShadow.light2};
`;

export const StyledListItemButton = styled(ListItemButton)`
  color: ${variables.palette.on_surface};
  font-size: ${variables.font.size.lg};
  padding: ${theme.spacing(1.2, 2)};

  &:last-of-type {
    margin-bottom: ${theme.spacing(0.6)};
  }
`;
