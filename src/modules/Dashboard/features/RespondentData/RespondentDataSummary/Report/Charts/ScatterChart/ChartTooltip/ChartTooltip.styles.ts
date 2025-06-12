import { Box, ListItemButton, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTooltip = styled(Box)`
  max-width: 20rem;
  min-width: 18rem;
  background-color: ${variables.palette.surface2};
  border-radius: ${variables.borderRadius.lg};
  box-shadow: ${variables.boxShadow.light2};
`;

export const StyledListItemButton = styled(ListItemButton)`
  color: ${variables.palette.on_surface};
  font-size: ${variables.font.size.body2};
  padding: ${theme.spacing(1.2, 2)};

  &:last-of-type {
    margin-bottom: ${theme.spacing(0.6)};
  }
`;
