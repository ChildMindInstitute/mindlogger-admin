import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledTabContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
  width: 100%;
`;

export const StyledSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;

  > .MuiTypography-root:first-of-type {
    color: ${variables.palette.on_surface};
    font-family: ${variables.font.family.title};
    font-size: 2rem;
    font-style: normal;
    font-weight: ${variables.font.weight.regular};
    line-height: 2.8rem;
  }
`;

export const StyledSectionTitle = styled(Box)`
  width: 59.6rem;

  .MuiTypography-root {
    color: ${variables.palette.on_surface};
    font-family: ${variables.font.family.title};
    font-size: 2.4rem;
    font-style: normal;
    font-weight: ${variables.font.weight.regular};
    line-height: 3.2rem;
  }
`;

export const StyledProfileSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(2)};
`;

export const StyledAvatarWrapper = styled(Box)`
  display: flex;
  width: 7.2rem;
  height: 7.2rem;
  justify-content: center;
  align-items: center;
  gap: 2.25rem;
  flex-shrink: 0;
  border-radius: 224.775rem;
  border: 0.225rem solid ${variables.palette.surface_variant};
  overflow: hidden;
  background-color: ${variables.palette.primary_container};
`;

export const StyledEmailSection = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

export const StyledEmailLabel = styled(Box)`
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.title};
  font-size: 2rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: 2.8rem;
`;

export const StyledEmailText = styled(Box)`
  color: ${variables.palette.on_surface_variant};
  font-family: ${variables.font.family.body};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: 2.4rem;
  letter-spacing: 0.05rem;
`;

export const StyledDivider = styled(Box)`
  height: 1px;
  align-self: stretch;
  background: ${variables.palette.surface_variant};
`;

export const StyledChangeButton = styled('button')<{ isRemove?: boolean }>`
  display: flex;
  min-width: 147px;
  height: 48px;
  padding: 10px 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 100px;
  border: 1px solid ${variables.palette.outline};
  text-transform: none;
  flex-shrink: 0;
  color: ${(props) => (props.isRemove ? variables.palette.error40 : variables.palette.primary)};
  text-align: center;
  font-family: ${variables.font.family.label};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: 2.4rem;
  letter-spacing: 0.15px;
  background: transparent;
  cursor: pointer;

  &:hover {
    border-color: ${(props) =>
      props.isRemove ? variables.palette.error40 : variables.palette.primary};
    background-color: ${(props) =>
      props.isRemove ? `${variables.palette.error40}14` : variables.palette.primary_alpha12};
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }
`;

export const StyledAuthenticatorRow = styled(Box)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

export const StyledAuthenticatorContent = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-shrink: 0;
`;

export const StyledAuthenticatorIcon = styled(Box)`
  display: flex;
  padding: 6px;
  align-items: center;
  gap: 10px;

  svg {
    width: 24px;
    height: 24px;
  }

  &.disabled {
    opacity: 0.38;
  }
`;

export const StyledAuthenticatorInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 600px;
`;

export const StyledAuthenticatorTitle = styled(Box)`
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.title};
  font-size: 2rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: 2.8rem; /* 140% */
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledEnabledBadge = styled(Box)`
  display: flex;
  width: 95px;
  height: 32px;
  padding: 4px 12px 4px 8px;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  background: ${variables.palette.green_light};

  svg {
    width: 18px;
    height: 18px;
  }

  span {
    width: 53px;
    height: 20px;
    color: ${variables.palette.on_primary_container};
    font-family: ${variables.font.family.label};
    font-size: 1.4rem;
    font-style: normal;
    font-weight: ${variables.font.weight.regular};
    line-height: 2rem;
    letter-spacing: 0.1px;
    text-align: center;
  }
`;

export const StyledAuthenticatorDescription = styled(Box)`
  color: ${variables.palette.on_surface_variant};
  font-family: ${variables.font.family.input};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: normal;
  letter-spacing: 0.15px;
  max-width: 60rem;

  &.disabled {
    opacity: 0.38;
  }
`;

export const StyledTwoFactorDescription = styled(Box)`
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.input};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: 2.4rem;
  letter-spacing: 0.5px;
`;

export const StyledRecoveryOptionsHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${variables.palette.on_surface_variant};
  font-family: ${variables.font.family.title};
  font-size: 2.4rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: 3.2rem; /* 133.333% */
  opacity: 0.38;
`;

export const StyledRecoveryCodesTitle = styled(Box)`
  color: ${variables.palette.on_surface_variant};
  font-family: ${variables.font.family.title};
  font-size: 2rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: 2.8rem; /* 140% */
  opacity: 0.38;
`;
