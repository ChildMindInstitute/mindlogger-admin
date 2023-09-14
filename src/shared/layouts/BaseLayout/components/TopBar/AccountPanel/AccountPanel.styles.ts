import { styled } from '@mui/system';
import { Drawer, Box, Button } from '@mui/material';

import {
  theme,
  variables,
  StyledFlexAllCenter,
  StyledFlexSpaceBetween,
  StyledQuantityCircle,
} from 'shared/styles';

import { ACCOUNT_HEADER_HEIGHT, ACCOUNT_FOOTER_HEIGHT } from './AccountPanel.const';

export const StyledAccountDrawer = styled(Drawer)`
  left: auto;

  .MuiPaper-root {
    height: 100%;
    width: 40rem;
    padding: ${theme.spacing(1.6, 0, 1.2)};
    background-color: ${variables.palette.surface1};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: unset;
  }
`;

export const StyledHeader = styled(StyledFlexSpaceBetween)`
  height: ${ACCOUNT_HEADER_HEIGHT};
  padding: ${theme.spacing(1.4, 1.6, 0)};
`;

export const StyledHeaderInfo = styled(Box)`
  margin-right: ${theme.spacing(1.2)};
  overflow: hidden;
  max-width: 27.5rem;

  p:first-of-type {
    margin-bottom: ${theme.spacing(0.2)};
  }
`;

export const StyledAvatarWrapper = styled(StyledFlexAllCenter)`
  margin-right: ${theme.spacing(1.2)};
  border-radius: ${variables.borderRadius.half};
  background-color: ${variables.palette.primary_container};
  height: 4rem;
  width: 4rem;
  position: relative;
`;

export const StyledFooter = styled(Box)`
  height: ${ACCOUNT_FOOTER_HEIGHT};
  padding: ${theme.spacing(1.6, 0, 0, 1.6)};
`;

export const StyledLogOutBtn = styled(Button)`
  color: ${variables.palette.on_surface_variant};
  font-weight: ${variables.font.weight.regular};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledQuantity = styled(StyledQuantityCircle)`
  top: -0.1rem;
  right: -0.1rem;
  min-width: 1.6rem;
  padding: ${theme.spacing(0.3)};
`;

export const StyledCloseWrapper = styled(Box)`
  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledDivider = styled('hr')`
  background-color: ${variables.palette.surface_variant};
  height: 0.1rem;
  border: 0;
  margin: ${theme.spacing(0, 1.6)};
`;
