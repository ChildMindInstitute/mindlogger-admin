import { styled } from '@mui/system';
import { Button, DialogTitle, Dialog, DialogActions } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: ${variables.palette.surface3};
    width: ${({ width }: { width?: string }) => (width ? `${width}rem` : '43.4rem')};
  }
`;

export const StyledDialogTitle = styled(DialogTitle)`
  padding: ${theme.spacing(4.8, 2.4, 3.4)};
`;

export const StyledCloseButton = styled(StyledClearedButton)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  border-radius: ${variables.borderRadius.half};
  padding: 1.5rem;
`;

export const StyledDialogActions = styled(DialogActions)`
  justify-content: center;
`;

export const StyledOkButton = styled(Button)`
  font-weight: ${variables.font.weight.semiBold};
`;
