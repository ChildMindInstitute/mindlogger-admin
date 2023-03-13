import { Menu } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';

export const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background-color: ${variables.palette.surface2};
    border-radius: ${variables.borderRadius.lg};
    box-shadow: ${variables.boxShadow.light2};
    margin-top: ${theme.spacing(0.4)};
    padding: ${theme.spacing(0, 0.4)};
  }

  .MuiMenuItem-root {
    text-transform: capitalize;
    border-radius: ${variables.borderRadius.xxs};

    &:hover {
      background-color: ${variables.palette.surface_variant};
    }

    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }
`;
