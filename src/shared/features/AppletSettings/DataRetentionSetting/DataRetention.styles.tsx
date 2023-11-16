import { styled, Box, Button } from '@mui/material';

import theme from 'shared/styles/theme';

export const StyledContainer = styled(Box)`
  display: flex;
  width: 40rem;
  margin: ${theme.spacing(2.4, 0)};
`;

export const StyledInputWrapper = styled(Box)`
  margin-right: ${theme.spacing(2.4)};
  width: 10.2rem;

  .MuiInputBase-inputAdornedEnd {
    padding-right: 0;

    & ~ div > div {
      margin-left: 0;
    }
  }
`;

export const StyledButton = styled(Button)`
  padding: ${theme.spacing(1.4, 3.6)};
`;
