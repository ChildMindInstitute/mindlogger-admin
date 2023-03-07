import { styled, Box, TextField } from '@mui/material';

import { StyledBodyMedium, StyledFlexColumn } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledTextField = styled(TextField)`
  .read-only {
    color: ${variables.palette.outline};
  }

  width: 100%;
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const StyledTextFieldContainer = styled(Box)`
  position: relative;
`;

export const StyledCounter = styled(StyledBodyMedium)`
  position: absolute;
  bottom: 2.4rem;
  right: 1.5rem;
  color: ${variables.palette.on_surface_variant};
`;

export const StyledUpDown = styled(StyledFlexColumn)`
  margin-left: ${theme.spacing(1.5)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
