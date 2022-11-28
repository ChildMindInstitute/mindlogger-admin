import { Box, Button, styled, TableCell } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledAppletName = styled(Box)`
  display: flex;
  align-items: center;
`;

export const StyledRightCell = styled(TableCell)`
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
  right: 4rem;
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
