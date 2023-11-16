import { styled, Button, DialogTitle, Dialog, DialogActions, Box } from '@mui/material';

import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { FontWeight, StyledClearedButton } from 'shared/styles/styledComponents';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: ${variables.palette.surface3};
    width: 66rem;
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
  padding: 0.8rem;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledDialogActions = styled(DialogActions, shouldForwardProp)`
  justify-content: space-between;
`;

export const StyledButton = styled(Button)`
  font-weight: ${({ fontWeight }: { fontWeight?: FontWeight }) =>
    fontWeight ? variables.font.weight[fontWeight] : variables.font.weight.bold};
  padding: ${theme.spacing(1.4, 3.4)};
`;

export const StyledButtonsContainer = styled(Box)``;
