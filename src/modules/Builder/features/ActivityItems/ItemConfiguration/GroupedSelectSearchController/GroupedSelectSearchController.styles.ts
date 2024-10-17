import { styled, MenuItem, ListItem, Select } from '@mui/material';

import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

const {
  palette,
  borderWidth,
  font: { size, letterSpacing, lineHeight, weight },
} = variables;

export const StyledGroupName = styled(ListItem, shouldForwardProp)`
  margin-top: ${theme.spacing(0.8)};
  padding: ${theme.spacing(2, 2, 1.2)};
  border-top: ${borderWidth.md} solid ${palette.surface_variant};
  background-color: transparent;
  font-size: ${size.md};
  line-height: ${lineHeight.md};
  font-weight: ${weight.bold};
  text-transform: uppercase;
  color: ${palette.outline};
  letter-spacing: ${letterSpacing.sm};
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

export const StyledSelect = styled(Select)`
  &.MuiInputBase-root.MuiOutlinedInput-root {
    padding: 0;
  }

  .MuiSelect-select.MuiSelect-outlined.MuiOutlinedInput-input {
    max-width: 100%;
    z-index: 1;
  }

  svg {
    fill: ${palette.on_surface_variant};
  }

  .svg-checkbox-multiple-filled {
    stroke: ${palette.on_surface_variant};
  }

  .navigate-arrow {
    pointer-events: none;
    position: absolute;
    right: 1rem;
  }
`;

export const StyledListSubheader = styled(ListItem)`
  padding: ${theme.spacing(0, 2)};

  form {
    width: 100%;
  }

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

  .svg-checkbox-multiple-filled {
    stroke: ${palette.on_surface_variant};
  }
`;
