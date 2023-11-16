import { styled } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles';

export const StyledInputWrapper = styled(StyledFlexTopCenter)`
  width: 50%;

  .MuiFormHelperText-root.Mui-error {
    position: static;
  }
`;
