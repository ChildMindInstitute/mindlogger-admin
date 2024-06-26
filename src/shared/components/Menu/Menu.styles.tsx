import { styled, Menu } from '@mui/material';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { MenuUiType } from './Menu.const';

export const StyledMenu = styled(Menu, shouldForwardProp)`
  && {
    .MuiPaper-root {
      background-color: ${({ uiType }: { uiType?: MenuUiType }) =>
        uiType === MenuUiType.Tertiary ? variables.palette.surface : variables.palette.surface2};
      border-radius: ${variables.borderRadius.lg};
      box-shadow: ${variables.boxShadow.light2};
      margin-top: ${theme.spacing(0.4)};
      padding: ${theme.spacing(0, 0.4)};
    }

    .MuiMenuItem-root {
      padding: 0;

      &.Mui-disabled {
        pointer-events: auto;
      }
    }
  }

  .MuiMenuItem-root {
    ${({ uiType }) => uiType === MenuUiType.Primary && 'text-transform: capitalize;'}
    border-radius: ${variables.borderRadius.xxs};

    &:hover {
      background-color: ${variables.palette.surface_variant};
    }
  }
`;

export const StyledMenuItemContent = styled(StyledFlexTopCenter, shouldForwardProp)`
  width: 100%;
  padding: ${theme.spacing(1.6)};

  && {
    svg {
      fill: ${({ customItemColor }: { customItemColor?: string }) =>
        customItemColor || variables.palette.on_surface_variant};
    }
  }
`;
