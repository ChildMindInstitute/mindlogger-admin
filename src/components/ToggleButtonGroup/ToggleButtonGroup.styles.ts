import { Box, styled, ToggleButton } from '@mui/material';

import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledIcon = styled(Box)`
  display: flex;
  margin-right: 0.8rem;

  svg {
    fill: ${variables.palette.on_secondary_container};
  }
`;

export const StyledToggleBtn = styled(ToggleButton, shouldForwardProp)`
  ${({ withIcon }: { withIcon: boolean }) =>
    withIcon &&
    `
    &.MuiToggleButton-root {
      border-color: ${variables.palette.surface_variant};
    }
    
    &.MuiToggleButton-root.MuiToggleButtonGroup-grouped:not(:first-of-type) {
      border-left-color: ${variables.palette.surface_variant};
    }
    
    &.MuiToggleButton-root.Mui-selected {
      font-weight: ${variables.font.weight.bold};
    }
  `}
`;
