import { styled } from '@mui/system';
import { ListItem, Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { blendColorsNormal } from 'shared/utils/colors';
import { StyledFlexAllCenter } from 'shared/styles/styledComponents';
import { LEFT_BAR_WIDTH } from 'consts';

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
        variables.palette.on_primary_container_alfa8,
      )};
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
    content: '';
    position: absolute;
    width: 5.6rem;
    height: 3.2rem;
    background: ${variables.palette.primary_container};
    border-radius: ${variables.borderRadius.xxxl};
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
`;

export const StyledDrawerLogo = styled(StyledFlexAllCenter)`
  margin-bottom: ${theme.spacing(1.8)};
  margin-top: ${theme.spacing(2.6)};
  cursor: pointer;
`;
