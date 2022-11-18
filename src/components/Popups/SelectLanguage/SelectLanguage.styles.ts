import { styled } from '@mui/system';
import { Box, Button, Dialog, DialogActions, List, ListItemButton } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: ${variables.palette.surface3};
    width: 43.4rem;
  }
`;

export const StyledCloseButton = styled(StyledClearedButton)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  border-radius: ${variables.borderRadius.half};
  padding: 1.5rem;
`;

export const StyledList = styled(List)`
  padding: ${theme.spacing(0.4, 2.4)};
`;

export const StyledListItemButton = styled(ListItemButton)`
  display: flex;
  padding: ${theme.spacing(1.4, 2)};
  border-radius: ${variables.borderRadius.lg};
`;

export const StyledBox = styled(Box)`
  padding: ${theme.spacing(0, 2)};
`;

export const StyledItemContent = styled(Box)`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const StyledSelect = styled(Box)`
  text-align: center;
  width: 2.4rem;
`;

export const StyledDialogActions = styled(DialogActions)`
  justify-content: center;
`;

export const StyledOkButton = styled(Button)`
  font-weight: ${variables.font.weight.semiBold};
`;
