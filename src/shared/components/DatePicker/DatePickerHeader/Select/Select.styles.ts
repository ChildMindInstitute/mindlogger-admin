import { styled, FormControl } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledFormControl = styled(FormControl)`
  .MuiInputBase-root {
    .MuiSelect-select.MuiSelect-standard {
      padding-right: ${theme.spacing(1.5)};

      &:focus {
        background-color: transparent;
      }
    }

    .MuiSelect-icon {
      width: 2rem;
      height: 2rem;
      fill: ${variables.palette.on_surface_variant};
    }

    &:before,
    &:after {
      display: none;
    }
  }
`;
