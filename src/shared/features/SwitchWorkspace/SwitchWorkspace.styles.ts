import { styled, Drawer, Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { LEFT_BAR_WIDTH } from 'shared/consts';

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
  background-color: ${variables.palette.outline_variant};
  height: 0.1rem;
  border: 0;
  margin: ${theme.spacing(1.2, 1.6)};
`;
