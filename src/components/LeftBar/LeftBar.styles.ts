import { styled } from '@mui/system';
import { ListItem, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledDrawer = styled(Box)`
  background-color: ${variables.palette.surface1};
  padding: ${theme.spacing(0, 0.9)};
  border-right: none;
  min-width: 8.8rem;
`;

export const StyledDrawerItem = styled(ListItem)`
  padding: 0;
  margin-bottom: ${theme.spacing(2.8)};
  justify-content: center;

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
      fill: ${variables.palette.on_surface};
      position: relative;
      z-index: 2;
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

export const StyledDrawerLogo = styled(Box)`
  margin-bottom: ${theme.spacing(1.8)};
  margin-top: ${theme.spacing(2.6)};
  text-align: center;
`;
