import { styled } from '@mui/system';
import { Box, OutlinedInput } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledTextField = styled(OutlinedInput)`
  height: 5.6rem;
  width: 100%;
  background-color: ${variables.palette.surface};
  border-radius: 2.2rem;
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding-left: 14px;

  &.Mui-focused {
    border: ${variables.borderWidth.lg} solid ${variables.palette.primary};
  }

  .MuiOutlinedInput-input {
    padding: 0;

    ::placeholder {
      color: ${variables.palette.on_surface};
      opacity: 1;
    }
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

export const StyledIcon = styled(Box)`
  display: flex;
  margin-right: ${theme.spacing(0.2)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledSelectedIcon = styled(Box)`
  display: flex;
  margin-right: ${theme.spacing(1.2)};
`;
