import { styled, Dialog, DialogContent, Box } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    max-width: 102.3rem;
    width: 100%;
    border-radius: ${variables.borderRadius.lg};
    background-color: ${variables.palette.surface1};
  }
`;

export const StyledHeader = styled(Box)`
  display: flex;
  padding: 20px 20px 16px 32px;
  flex-direction: column;
  align-items: flex-end;
  align-self: stretch;
`;

export const StyledCloseButton = styled(Box)`
  display: flex;
  width: 48px;
  height: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledDialogContent = styled(DialogContent)<{ hasBanner?: boolean }>`
  display: flex;
  padding: ${({ hasBanner }) => (hasBanner ? '0 64px 64px' : '64px')};
  padding-top: ${({ hasBanner }) => (hasBanner ? '64px' : '64px')};
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
`;

export const StyledBannerContainer = styled(Box)`
  width: 100%;
  align-self: stretch;
`;

export const StyledTabsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  padding: 0 32px;
  border-bottom: 1px solid ${variables.palette.outline_variant};
`;

export const StyledTab = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex: 1 0 0;
  padding: ${theme.spacing(1.2, 2)};
  cursor: pointer;
  border-bottom: 2px solid ${variables.palette.primary};

  .MuiTypography-root {
    color: ${variables.palette.primary};
    text-align: center;
    font-family: ${variables.font.family.label};
    font-size: 1.4rem;
    font-style: normal;
    font-weight: ${variables.font.weight.regular};
    line-height: 2rem;
    letter-spacing: 0.1px;
  }
`;

export const StyledTwoFactorTitleContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

export const StyledTwoFactorTitle = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;

  .MuiTypography-root {
    color: ${variables.palette.on_surface};
    text-align: left;
    font-family: ${variables.font.family.body};
    font-size: 1.6rem;
    font-style: normal;
    font-weight: ${variables.font.weight.regular};
    line-height: 2.4rem;
    letter-spacing: 0.15px;
  }
`;
