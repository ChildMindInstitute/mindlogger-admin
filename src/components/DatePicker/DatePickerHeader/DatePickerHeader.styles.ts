import { Box } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

export const StyledHeader = styled(Box)`
  display: grid;
  align-items: center;
  display: flex;
  padding: ${theme.spacing(0.8, 0)};
`;

export const StyledCol = styled(Box)`
  display: flex;
`;

export const StyledIconBtn = styled(StyledClearedButton)`
  width: 4rem;
  height: 4rem;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  &:hover {
    svg {
      fill: ${variables.palette.primary};
    }
  }
`;

export const StyledSelect = styled(Box)`
  color: ${variables.palette.on_surface_variant};
  grid-column-start: 2;
  display: flex;
  align-items: center;

  .MuiTypography-root {
    font-size: ${variables.font.size.lg};
    line-height: ${variables.lineHeight.lg};
    font-weight: ${variables.font.weight.regular};
  }

  .MuiSelect-select {
    padding: 0;
  }

  .MuiFormControl-root .MuiInputBase-root .MuiSelect-select.MuiSelect-standard {
    padding-right: ${theme.spacing(2.5)};
  }

  .MuiFormControl-root .MuiInputBase-root .MuiSelect-icon {
    top: 0.3rem;
  }
`;
