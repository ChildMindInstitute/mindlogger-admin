import { Box, styled, TextField } from '@mui/material';

import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledLabel = styled(StyledBodyMedium)`
  margin: ${theme.spacing(0, 0.4, 0, 1.2)};
`;

export const StyledTextField = styled(TextField)`
  .MuiInputBase-root.MuiOutlinedInput-root {
    width: 12rem;
    color: ${variables.palette.primary};
    font-size: ${variables.font.size.md};
    font-weight: ${variables.font.weight.regular};
    line-height: ${variables.font.lineHeight.md};
    background-color: transparent;
    border-radius: ${variables.borderRadius.xxxl};
    padding: ${theme.spacing(0, 1.6)};

    &.Mui-focused {
      background-color: ${variables.palette.primary_alfa12};
    }
  }

  .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input {
    padding: ${theme.spacing(1, 0)};
  }
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

export const StyledSvgContainer = styled(Box)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
