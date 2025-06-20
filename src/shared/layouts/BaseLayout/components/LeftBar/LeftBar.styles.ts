import { Box, ListItem, styled } from '@mui/material';

import { LEFT_BAR_WIDTH } from 'shared/consts';
import { StyledFlexAllCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { blendColorsNormal } from 'shared/utils/colors';

const ItemBefore = `
  content: '';
  position: absolute;
  width: 5.6rem;
  height: 3.2rem;
  border-radius: ${variables.borderRadius.xxxl};
  left: 50%;
  top: 0;
  transform: translateX(-50%);  
`;

export const StyledDrawer = styled(Box)`
  background-color: ${variables.palette.surface1};
  padding: ${theme.spacing(0, 0.9)};
  border-right: none;
  width: ${LEFT_BAR_WIDTH};
`;

export const StyledDrawerItem = styled(ListItem)`
  padding: 0;
  margin-bottom: ${theme.spacing(2.8)};
  justify-content: center;

  &:hover {
    .active-link:before {
      background: ${blendColorsNormal(
        variables.palette.primary_container,
        variables.palette.on_primary_container_alpha8,
      )};
    }

    :before {
      ${ItemBefore}
      background: ${variables.palette.on_surface_alpha8};
    }
  }

  a {
    text-decoration: none;
    display: block;
    position: relative;
    text-align: center;
    padding-top: ${theme.spacing(0.45)};

    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }

  .active-link {
    svg {
      position: relative;
      z-index: ${theme.zIndex.fab};
    }
  }

  .active-link:before {
    ${ItemBefore}
    background: ${variables.palette.primary_container};
  }

  .disabled-link {
    pointer-events: none;
  }
`;

export const StyledDrawerLogo = styled(StyledFlexAllCenter)`
  margin-bottom: ${theme.spacing(1.8)};
  margin-top: ${theme.spacing(2.6)};
  cursor: pointer;
`;
