import { styled } from '@mui/material';

import { StyledSmallNumberInput, theme } from 'shared/styles';

export const StyledLambdaScopeInput = styled(StyledSmallNumberInput)`
  .MuiInputBase-root {
    padding-left: 0;

    .MuiInputBase-input {
      margin-right: ${theme.spacing(2.2)};
      margin-left: ${theme.spacing(1.9)};
      padding-left: 0;
      text-align: end;
    }

    > .MuiBox-root > .MuiTypography-root {
      position: absolute;
      right: 3.5rem;
      top: 0.6rem;
    }
  }
`;
