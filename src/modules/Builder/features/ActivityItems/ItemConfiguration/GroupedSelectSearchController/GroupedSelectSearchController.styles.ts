import { styled, MenuItem, ListItem, Select } from '@mui/material';

import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

const {
  palette,
  borderWidth,
  font: { size, letterSpacing, lineHeight, weight },
} = variables;

export const StyledSelect = styled(Select)`
  padding-right: ${theme.spacing(0.8)};
`;

export const StyledGroupName = styled(ListItem, shouldForwardProp)`
  padding: ${theme.spacing(1.6)};
  border-top: ${borderWidth.md} solid ${palette.outline_variant};
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

  .marked {
    background-color: ${variables.palette.yellow};
    border-radius: ${variables.borderRadius.xs};
  }

  svg {
    fill: ${palette.on_surface_variant};
  }

  .svg-checkbox-multiple-filled {
    stroke: ${palette.on_surface_variant};
  }
`;

export const StyledListSubheader = styled(ListItem)`
  padding: ${theme.spacing(0, 1.6)};

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
`;
