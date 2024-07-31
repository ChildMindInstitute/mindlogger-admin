import { Box, Dialog, DialogActions, DialogTitle, styled } from '@mui/material';

import { StyledClearedButton } from 'shared/styles/styledComponents/Buttons';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { ActionsAlign } from './Modal.types';

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    // Use the modalBackground variable to prevent unexpected styles for table headings inside modals.
    background-color: ${variables.modalBackground};
    width: ${({ width }: { width?: string; height?: string }) => (width ? `${width}rem` : 'auto')};
    max-width: 100rem;
    height: ${({ height }) => height || 'auto'};
    overflow-y: unset;
  }
`;

export const StyledDialogHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing(3.2, 3.2, 0.8)};
`;

export const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  align-items: center;
  && {
    padding: ${theme.spacing(0)};
    color: ${variables.palette.on_surface};
  }
`;

export const StyledCloseButton = styled(StyledClearedButton)`
  height: 4rem;
  border-radius: ${variables.borderRadius.half};
  padding: 0.8rem;
  margin: 0.4rem;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledDialogActions = styled(DialogActions, shouldForwardProp)`
  justify-content: ${({ actionsAlign }: { actionsAlign?: ActionsAlign }) =>
    actionsAlign || 'flex-start'};
  margin-top: auto;
  padding: ${theme.spacing(0.8, 3.2, 3.2)};
`;
