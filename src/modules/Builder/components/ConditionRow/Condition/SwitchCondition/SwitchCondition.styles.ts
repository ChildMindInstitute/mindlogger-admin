import { Box, styled } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { variables, theme, StyledFlexTopCenter } from 'shared/styles';

export const StyledInputController = styled(InputController)`
  width: 8rem;

  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.md};
    padding-right: ${theme.spacing(0.7)};

    &.Mui-error {
      background: ${variables.palette.error_container};
    }
  }

  .MuiInputBase-input {
    padding: ${theme.spacing(0.6, 1.2)};
  }

  .MuiBox-root {
    margin-left: 0;
  }

  .MuiFormHelperText-root {
    display: none;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${variables.palette.outline};
  }
`;

export const StyledTimeRow = styled(StyledFlexTopCenter)`
  justify-content: space-between;
`;

export const StyledTimeWrapper = styled(Box)`
  width: 20rem;
`;
