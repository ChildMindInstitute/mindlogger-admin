import { Box, Button, styled, TableCell } from '@mui/material';
import { FolderApplet } from 'redux/modules';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledAppletName = styled(Box)`
  display: flex;
  align-items: center;
  margin-left: ${({ applet }: { applet: FolderApplet }) =>
    applet?.depth ? `${applet.depth * 4.4}rem` : 0};
`;

export const StyledCell = styled(TableCell)`
  position: relative;

  &:hover {
    .cell-actions {
      display: flex;
    }
  }
`;

export const StyledActions = styled(Box)`
  display: none;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 5rem;
  transform: translateY(-50%);
`;

export const StyledActionButton = styled(Button)`
  width: 4rem;
  height: 4rem;
  min-width: 4rem;
  padding: 0;
  border-radius: ${variables.borderRadius.half};
  margin-right: ${theme.spacing(1)};

  &:hover {
    background: ${variables.palette.secondary_container};

    svg {
      fill: ${variables.palette.primary};
    }
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
