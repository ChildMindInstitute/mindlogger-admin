import { List, ListItem, ListItemButton, styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledList = styled(List)`
  height: 29.6rem;
  overflow-y: auto;
  padding: ${theme.spacing(0.8, 0)};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.lg};
`;

export const StyledListItem = styled(ListItem)`
  padding: 0;

  .MuiListItemSecondaryAction-root {
    pointer-events: none;
  }
`;

export const StyledReadOnlyButton = styled(StyledFlexTopCenter)`
  padding: ${theme.spacing(1.2, 1.6)};
`;

export const StyledListItemButton = styled(ListItemButton)`
  padding: ${theme.spacing(1.2, 1.6)};
`;

export const StyledListItemTextPrimary = styled(StyledFlexTopCenter)`
  letter-spacing: ${variables.font.letterSpacing.xxl};
  gap: ${theme.spacing(0.8)};
`;
