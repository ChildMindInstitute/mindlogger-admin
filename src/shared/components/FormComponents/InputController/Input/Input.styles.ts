import { styled, Box, TextField } from '@mui/material';

import { StyledBodyMedium } from 'shared/styles/styledComponents/Typography';
import { StyledFlexColumn } from 'shared/styles/styledComponents/Flex';
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
        border-color: ${variables.palette.on_surface_alfa12};
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
    min-height: ${variables.font.lineHeight.sm};
    margin-bottom: -${variables.font.lineHeight.sm};
  }
`;

export const StyledCounter = styled(StyledBodyMedium, shouldForwardProp)`
  ${commonHintProps};
  color: ${({ hasError }: { hasError?: boolean }) =>
    hasError ? variables.palette.semantic.error : variables.palette.on_surface_variant};
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
