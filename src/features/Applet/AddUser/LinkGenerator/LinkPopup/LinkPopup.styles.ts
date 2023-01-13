import { styled } from '@mui/system';
import { Button, DialogTitle, Dialog, DialogActions, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: ${variables.palette.surface3};
    width: 43.4rem;
  }
`;

export const StyledDialogTitle = styled(DialogTitle)`
  padding: ${theme.spacing(4.8, 2.4, 3.4)};
`;

export const StyledContent = styled(Box)`
  padding: ${theme.spacing(0.4, 2.4)};
`;

export const StyledCloseButton = styled(StyledClearedButton)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  border-radius: ${variables.borderRadius.half};
  padding: 0.8rem;
`;

export const StyledDialogActions = styled(DialogActions)`
  justify-content: center;
`;

export const StyledButton = styled(Button)`
  font-weight: ${variables.font.weight.bold};
`;
