import { styled, MenuItem, Select, ListSubheader } from '@mui/material';

import { variables } from 'styles/variables';

const { size, letterSpacing, lineHeight, weight } = variables.font;

export const StyledSelect = styled(Select)`
  .svg-checkbox-multiple-filled {
    stroke: ${variables.palette.on_surface_variant};
  }
`;

export const StyledGroupName = styled(MenuItem)`
  border-top: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  background-color: transparent;
  font-size: ${size.md};
  line-height: ${lineHeight.md};
  font-weight: ${weight.bold};
  text-transform: uppercase;
  color: ${variables.palette.outline};
  letter-spacing: ${letterSpacing.sm};
  pointer-events: none;
  cursor: default;
`;

export const StyledMenuItem = styled(MenuItem)`
  color: ${variables.palette.on_surface};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  .svg-checkbox-multiple-filled {
    stroke: ${variables.palette.on_surface_variant};
  }
`;

export const StyledListSubheader = styled(ListSubheader)`
  background-color: transparent;
  position: static;

  .MuiInputBase-root {
    padding: 0;
    color: ${variables.palette.outline};
    letter-spacing: ${letterSpacing.xxl};
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
