import { FormControlLabel, TextField, styled, Button } from '@mui/material';

import { theme, variables } from 'shared/styles';

import { Svg } from '../Svg';

export const StyledTextField = styled(TextField)`
  display: none;
`;

export const StyledLabel = styled(FormControlLabel)`
  border-radius: ${variables.borderRadius.lg2};
  border: ${variables.borderWidth.lg} dashed ${variables.palette.outline_variant};
  width: 100%;

  &.MuiFormControlLabel-root {
    margin: 0;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20rem;
    width: 100%;
  }

  em {
    color: ${variables.palette.primary};
    font-style: normal;
  }
`;

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.primary};
`;

export const StyledButton = styled(Button)`
  min-width: unset;
  height: unset;
  padding: ${theme.spacing(1)};
  margin-left: ${theme.spacing(0.8)};
`;
