import { styled } from '@mui/system';
import { Drawer, ListItem, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { LEFT_BAR_WIDTH } from './LeftBar.const';

export const StyledDrawer = styled(Drawer)`
  .drawer-paper {
    background-color: ${variables.palette.primary95};
    width: ${LEFT_BAR_WIDTH};
    border-right: none;
  }
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
  }

  .active-link:before {
    content: '';
    position: absolute;
    width: 5.6rem;
    height: 3.2rem;
    background: ${variables.palette.primary80};
    border-radius: ${variables.borderRadius.xxl};
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    z-index: -1;
  }
`;

export const StyledDrawerLogo = styled(Box)`
  margin-bottom: ${theme.spacing(1.8)};
  margin-top: ${theme.spacing(2.6)};
  text-align: center;
`;
