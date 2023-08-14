import { Box, ListItemButton, styled } from '@mui/material';

import { StyledBodyLarge, StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledListItemButton = styled(ListItemButton)`
  display: flex;
  padding: ${theme.spacing(1.6, 2.4)};
  margin: ${theme.spacing(0, 0.8)};
  border-radius: ${variables.borderRadius.xxxl};
`;

export const StyledItemContent = styled(StyledFlexTopCenter)`
  flex: 1;
`;

export const StyledSelect = styled(Box)`
  text-align: center;
  width: 2.4rem;
  display: flex;
`;

export const StyledItemName = styled(StyledBodyLarge)`
  margin-left: ${theme.spacing(1.6)};
  color: ${variables.palette.on_surface};
  word-break: break-all;
`;
