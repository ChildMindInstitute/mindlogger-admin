import { styled } from '@mui/system';
import { FormControlLabel } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledFormControlLabel = styled(FormControlLabel)`
  margin: ${theme.spacing(0.6, 0)};

  .Mui-disabled {
    > p {
      opacity: ${variables.opacity.disabled};
    }
  }
`;
