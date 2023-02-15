import { styled } from '@mui/system';
import { Drawer, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { LEFT_BAR_WIDTH } from 'consts';

export const StyledSwitchWorkspaceDrawer = styled(Drawer)`
  left: auto;

  .MuiPaper-root {
    height: 100%;
    width: 36rem;
    margin-left: ${LEFT_BAR_WIDTH};
    padding: ${theme.spacing(1.6, 0)};
    background-color: ${variables.palette.surface1};
    border-left: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
    border-radius: 0 ${variables.borderRadius.lg2} ${variables.borderRadius.lg2} 0;
    box-shadow: unset;
  }
`;

export const StyledCloseWrapper = styled(Box)`
  padding: ${theme.spacing(1.4, 1.6, 0)};
  text-align: end;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledDivider = styled('hr')`
  border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  margin: ${theme.spacing(1.2, 1.6)};
`;
