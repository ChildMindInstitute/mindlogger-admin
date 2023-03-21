import { styled } from '@mui/material';

import { StyledClearedButton, StyledFlexTopCenter, variables, theme } from 'shared/styles';

import { StyledSelectionRow } from '../SelectionRows.styles';

export const StyledSelectionRowItem = styled(StyledSelectionRow)`
  border-top: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
`;

export const StyledItemContainer = styled(StyledFlexTopCenter)`
  min-height: 5.5rem;
  justify-content: center;
  gap: 1.2rem;
`;

export const StyledRemoveItemButton = styled(StyledClearedButton)`
  position: absolute;
  right: 0;
  padding: ${theme.spacing(1)};
`;
