import { styled, Menu } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { MenuUiType } from './Menu.const';

export const StyledMenu = styled(Menu, shouldForwardProp)`
  .MuiMenuItem-root {
    ${({ uiType }: { uiType?: MenuUiType }) =>
      uiType === MenuUiType.Primary && 'text-transform: capitalize;'}
  }
`;

export const StyledMenuItemContent = styled(StyledFlexTopCenter, shouldForwardProp)`
  width: 100%;

  && {
    svg {
      fill: ${({ customItemColor }: { customItemColor?: string }) =>
        customItemColor || variables.palette.on_surface_variant};
    }
  }
`;
