import { styled } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { theme, variables } from 'shared/styles';

export const StyledInputController = styled(InputController)`
  .MuiInputBase-root {
    padding-right: ${theme.spacing(0.3)};
  }

  .MuiInputBase-input {
    padding: ${theme.spacing(1.2, 0, 1.2, 1)};
  }

  && .MuiBox-root {
    margin-left: 0;
  }

  .MuiFormHelperText-root {
    position: absolute;
    bottom: -2.4rem;
    font-size: ${variables.font.size.label1};
    white-space: nowrap;
  }
`;
