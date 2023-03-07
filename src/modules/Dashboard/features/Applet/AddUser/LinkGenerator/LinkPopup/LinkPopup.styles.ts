import { styled } from '@mui/system';
import { Button, DialogTitle, Dialog, DialogActions, Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledClearedButton } from 'shared/styles/styledComponents';

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

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledDialogActions = styled(DialogActions)`
  justify-content: center;
`;

export const StyledButton = styled(Button)`
  font-weight: ${variables.font.weight.bold};
`;
