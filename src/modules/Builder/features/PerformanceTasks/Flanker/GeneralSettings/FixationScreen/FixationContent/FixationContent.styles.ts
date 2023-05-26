import { Box, styled } from '@mui/material';

import { StyledClearedButton, theme, variables } from 'shared/styles';

export const StyledRemoveButton = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.5)};
  margin-left: ${theme.spacing(0.2)};

  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledInputContainer = styled(Box)`
  width: 8.8rem;
  margin: ${theme.spacing(0, 0.4)};

  .MuiBox-root {
    margin: 0;
  }

  .MuiButton-root {
    height: 1.2rem;
  }

  .MuiInputBase-root {
    padding: ${theme.spacing(0, 1)};
    border-radius: ${variables.borderRadius.md};
    color: ${variables.palette.on_surface_variant};

    .MuiOutlinedInput-notchedOutline {
      border-color: ${variables.palette.outline};
    }

    &:hover,
    &.Mui-focused {
      .MuiOutlinedInput-notchedOutline {
        border-color: ${variables.palette.primary};
      }
    }
  }

  .MuiInputBase-input {
    padding: ${theme.spacing(0.7, 0)};
  }
`;
