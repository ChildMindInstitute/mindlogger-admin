import { styled } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import theme from 'shared/styles/theme';

export const StyledInputController = styled(InputController)`
  .MuiInputBase-input {
    padding: ${theme.spacing(1.2)};
  }
`;
