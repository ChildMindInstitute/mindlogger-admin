import { styled } from '@mui/material';

import { InputController } from 'components/FormComponents';
import theme from 'styles/theme';

export const StyledInputController = styled(InputController)`
  .MuiInputBase-input {
    padding: ${theme.spacing(1.2)};
  }
`;
