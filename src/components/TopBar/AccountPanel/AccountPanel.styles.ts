import { styled } from '@mui/system';
import { Drawer, Box, Button } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledAccountDrawer = styled(Drawer)`
  .MuiPaper-root {
    height: 100%;
    width: 40rem;
    padding: ${theme.spacing(1.6)};
    background-color: ${variables.palette.surface1};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

export const StyledHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledHeaderInfo = styled(Box)`
  text-align: right;
  margin-right: ${theme.spacing(1.2)};
`;

export const StyledHideBtn = styled(Button)`
  padding: 0;
  height: auto;
  min-width: unset;
`;

export const StyledHeaderRight = styled(Box)`
  display: flex;
  align-items: center;
`;

export const StyledAvatarWrapper = styled(Box)`
  border-radius: ${variables.borderRadius.half};
  background-color: ${variables.palette.outline_variant};
  height: 4rem;
  width: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledImage = styled('img')`
  width: 3.2rem;
  height: 3.2rem;
`;

export const StyledFooter = styled(Box)`
  margin: ${theme.spacing(0, 1.6)};
  padding: ${theme.spacing(2.7, 0, 0.8)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;

export const StyledLogOutBtn = styled(Button)`
  padding: ${theme.spacing(0.8, 0.4)};
  border-radius: ${variables.borderRadius.lg};
  height: auto;
  color: ${variables.palette.on_surface_variant};
`;
