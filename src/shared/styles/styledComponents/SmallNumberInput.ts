import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledSmallNumberInput = styled(Box)`
  min-width: 8.8rem;
  margin: ${theme.spacing(0.8, 0)};

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
`;

export const StyledSmallPercentageInput = styled(StyledSmallNumberInput)`
  .MuiInputBase-root {
    .MuiInputBase-input {
      margin-right: ${theme.spacing(0.75)};
      padding-right: 0;
      text-align: end;
    }

    > .MuiBox-root > .MuiTypography-root {
      margin-right: ${theme.spacing(0.75)};
    }
  }
`;
