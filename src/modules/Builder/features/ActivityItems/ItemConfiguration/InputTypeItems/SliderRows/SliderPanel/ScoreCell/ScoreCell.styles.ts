import { styled } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { theme } from 'shared/styles';

export const StyledInputController = styled(InputController)`
  .MuiInputBase-input {
    padding: ${theme.spacing(1.2, 0, 1.2, 1.2)};
  }

  && .MuiBox-root {
    margin-left: 0;
  }
`;
