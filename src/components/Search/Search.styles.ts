import { styled } from '@mui/system';
import { Box, OutlinedInput } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledTextField = styled(OutlinedInput)`
  height: 4rem;
  width: 49.8rem;

  .MuiOutlinedInput-input {
    padding: 0;

    ::placeholder {
      color: ${variables.palette.outline};
      opacity: 1;
    }
  }

  .MuiOutlinedInput-notchedOutline {
    border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
    border-radius: 2.2rem;
  }
`;

export const StyledIcon = styled(Box)`
  display: flex;
  margin-right: ${theme.spacing(2)};
`;
