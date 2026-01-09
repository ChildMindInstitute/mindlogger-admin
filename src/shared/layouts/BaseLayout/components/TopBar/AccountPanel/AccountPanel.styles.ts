import { styled, Drawer, Box, Button } from '@mui/material';

import { theme, variables, StyledFlexAllCenter } from 'shared/styles';

import { ACCOUNT_FOOTER_HEIGHT } from './AccountPanel.const';

export const StyledAccountDrawer = styled(Drawer)`
  left: auto;

  .MuiPaper-root {
    height: 100%;
    width: 40rem;
    padding: ${theme.spacing(1.6, 0, 1.2)};
    background-color: ${variables.palette.surface1};
    display: flex;
    flex-direction: column;
    box-shadow: unset;
    overflow: hidden;
  }
`;

export const StyledHeader = styled(Box)`
  display: flex;
  padding: ${theme.spacing(1.4, 1.6, 1.6)};
  flex-direction: column;
  align-items: flex-end;
  align-self: stretch;
`;

export const StyledHeaderInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing(0.2)};
  margin-left: ${theme.spacing(1.2)};
  flex: 1;
  overflow: hidden;
`;

export const StyledUserInfoWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1.2)};
  align-self: stretch;
  margin-top: ${theme.spacing(0.4)};
  margin-bottom: ${theme.spacing(1)};
`;

export const StyledAvatarWrapper = styled(StyledFlexAllCenter)`
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

export const StyledCloseWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledSettingsSection = styled(Box)`
  display: inline-flex;
  height: 4rem;
  padding: ${theme.spacing(1, 1.6, 1, 1.2)};
  align-items: center;
  gap: ${theme.spacing(0.8)};
  cursor: pointer;
  border-radius: ${variables.borderRadius.xxxl};
  transition: background-color 0.2s ease;
  align-self: flex-start;

  &:hover {
    background-color: ${variables.palette.on_surface_alpha8};
  }
`;

export const StyledSettingsIcon = styled(Box)`
  display: flex;
  width: 1.8rem;
  height: 1.8rem;
  align-items: center;
  justify-content: center;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledContentWrapper = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
