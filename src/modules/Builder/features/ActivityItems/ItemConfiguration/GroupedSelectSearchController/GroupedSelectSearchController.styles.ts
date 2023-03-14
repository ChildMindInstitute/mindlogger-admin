import { styled, MenuItem, Select, ListSubheader } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

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

export const StyledGroupName = styled(MenuItem, shouldForwardProp)`
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

export const StyledMenuItem = styled(MenuItem, shouldForwardProp)`
  color: ${palette.on_surface};
  display: ${({ isHidden }: { isHidden: boolean }) => (isHidden ? 'none' : 'flex')};

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
    color: ${palette.on_surface};
    letter-spacing: ${letterSpacing.xxl};
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  svg {
    fill: ${palette.on_surface_variant};
  }
`;
