import { Drawer, styled } from '@mui/material';

import { StyledFlexColumn } from 'styles/styledComponents';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

export const StyledDrawer = styled(Drawer)`
  width: 40rem;
  left: unset;
  flex-shrink: 0;
  position: absolute;
  margin-top: ${theme.spacing(6.1)};

  .MuiDrawer-paper {
    position: absolute;
    width: 40rem;
    box-sizing: border-box;
    box-shadow: unset;
  }
`;

export const StyledDrawerContent = styled(StyledFlexColumn)`
  height: 100%;
  background-color: ${variables.palette.surface_variant};

  padding: ${theme.spacing(2.4)};
  gap: 2.4rem;
`;
