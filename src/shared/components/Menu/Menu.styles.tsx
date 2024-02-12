import { styled, Menu } from '@mui/material';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { MenuUiType } from './Menu.const';

export const StyledMenu = styled(Menu, shouldForwardProp)`
  .MuiPaper-root {
    background-color: ${variables.palette.surface2};
    border-radius: ${variables.borderRadius.lg};
    box-shadow: ${variables.boxShadow.light2};
    margin-top: ${theme.spacing(0.4)};
    padding: ${theme.spacing(0, 0.4)};
  }

  .MuiMenuItem-root {
    ${({ uiType }: { uiType?: MenuUiType }) => uiType === MenuUiType.Primary && 'text-transform: capitalize;'}
    border-radius: ${variables.borderRadius.xxs};

    &:hover {
      background-color: ${variables.palette.surface_variant};
    }

    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }
`;
