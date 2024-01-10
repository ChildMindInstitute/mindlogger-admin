import { TextField, Box, styled } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';

export const StyledRow = styled(StyledFlexTopCenter)`
  width: 100%;
  margin-bottom: ${theme.spacing(1.6)};
`;

export const StyledTextField = styled(TextField)`
  margin-right: ${theme.spacing(1.6)};
  flex-grow: 1;
`;

export const StyledMaxCharacters = styled(StyledFlexTopCenter)`
  width: 20rem;
`;

export const StyledInputWrapper = styled(Box)`
  margin: ${theme.spacing(0.5, 0, 1.5)};

  .MuiFormHelperText-root.Mui-error {
    position: static;
  }
`;
