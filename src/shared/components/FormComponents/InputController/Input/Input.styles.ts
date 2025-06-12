import { Box, styled, TextField } from '@mui/material';

import { StyledFlexColumn } from 'shared/styles/styledComponents/Flex';
import { StyledBodyMedium } from 'shared/styles/styledComponents/Typography';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

const commonHintProps = `
  position: absolute;
  bottom: -2.1rem;
  right: 1.5rem;
  `;

export const StyledTextField = styled(TextField)`
  width: 100%;

  && {
    &:hover {
      .Mui-disabled .MuiOutlinedInput-notchedOutline {
        border-color: ${variables.palette.on_surface_alpha12};
      }
    }
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const StyledTextFieldContainer = styled(Box, shouldForwardProp)`
  position: relative;
  width: 100%;

  /* Mimics absolute positioning if error is 1 line, but word-wraps & expands if needed */
  .MuiFormHelperText-root {
    margin-top: 0;
    position: relative;
    top: ${theme.spacing(0.3)};
    min-height: ${variables.font.lineHeight.body4};
    margin-bottom: -${variables.font.lineHeight.body4};
  }
`;

export const StyledCounter = styled(StyledBodyMedium, shouldForwardProp)`
  ${commonHintProps};
  color: ${({ hasError }: { hasError?: boolean }) =>
    hasError ? variables.palette.error : variables.palette.on_surface_variant};
`;

export const StyledUpDown = styled(StyledFlexColumn)`
  margin-left: ${theme.spacing(1.5)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledHint = styled(StyledBodyMedium)`
  ${commonHintProps};
  color: ${variables.palette.on_surface_variant};
`;
