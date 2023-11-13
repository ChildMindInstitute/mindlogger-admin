import { Drawer, styled } from '@mui/material';

import { theme, variables, StyledFlexColumn } from 'shared/styles';

export const StyledDrawer = styled(Drawer)`
  width: 40rem;
  left: unset;
  flex-shrink: 0;
  position: absolute;
  margin-top: ${theme.spacing(6.1)};
  box-sizing: content-box;
  border: ${variables.borderRadius.xxs} solid ${variables.palette.surface_variant};

  .MuiDrawer-paper {
    position: absolute;
    width: 40rem;
    box-sizing: border-box;
    box-shadow: unset;
  }

  .MuiBackdrop-root {
    background-color: transparent;
  }
`;

export const StyledDrawerContent = styled(StyledFlexColumn)`
  height: 100%;
  background-color: ${variables.palette.surface1};

  padding: ${theme.spacing(2.4)};
  gap: 2.4rem;
`;

export const StyledSettings = styled(StyledFlexColumn)`
  overflow-x: hidden;
`;
