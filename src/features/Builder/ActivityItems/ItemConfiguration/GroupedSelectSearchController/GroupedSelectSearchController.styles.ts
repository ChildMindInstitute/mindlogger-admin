import { styled, MenuItem, Select, ListSubheader } from '@mui/material';

import { variables } from 'styles/variables';

const {
  palette,
  borderWidth,
  font: { size, letterSpacing, lineHeight, weight },
} = variables;

export const StyledSelect = styled(Select)`
  .svg-checkbox-multiple-filled {
    stroke: ${palette.on_surface_variant};
  }
`;

export const StyledGroupName = styled(MenuItem)`
  border-top: ${borderWidth.md} solid ${palette.outline_variant};
  background-color: transparent;
  font-size: ${size.md};
  line-height: ${lineHeight.md};
  font-weight: ${weight.bold};
  text-transform: uppercase;
  color: ${palette.outline};
  letter-spacing: ${letterSpacing.sm};
  pointer-events: none;
  cursor: default;
`;

export const StyledMenuItem = styled(MenuItem)`
  color: ${palette.on_surface};

  svg {
    fill: ${palette.on_surface_variant};
  }

  .svg-checkbox-multiple-filled {
    stroke: ${palette.on_surface_variant};
  }
`;

export const StyledListSubheader = styled(ListSubheader)`
  background-color: transparent;
  position: static;

  .MuiInputBase-root {
    padding: 0;
    color: ${palette.outline};
    letter-spacing: ${letterSpacing.xxl};
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  svg {
    fill: ${palette.on_surface_variant};
  }
`;
