import { Box } from '@mui/material';

import { Avatar } from 'shared/components';
import { auth } from 'redux/modules';
import { StyledTitleLarge, StyledBodyMedium, StyledBodyLarge, variables } from 'shared/styles';

import { MobileIcon } from './MobileIcon';
import { KeyIcon } from './KeyIcon';
import {
  StyledTabContent,
  StyledSection,
  StyledSectionTitle,
  StyledProfileSection,
  StyledAvatarWrapper,
  StyledEmailSection,
  StyledEmailLabel,
  StyledEmailText,
  StyledDivider,
  StyledChangeButton,
  StyledAuthenticatorRow,
  StyledAuthenticatorInfo,
  StyledAuthenticatorIcon,
  StyledTwoFactorDescription,
  StyledAuthenticatorTitle,
  StyledAuthenticatorDescription,
  StyledRecoveryOptionsHeader,
  StyledRecoveryCodesTitle,
} from './AccountTab.styles';

export const AccountTab = () => {
  // const { t } = useTranslation('app');
  const authData = auth.useData();
  const userInitials = auth.useUserInitials();

  return (
    <StyledTabContent>
      <StyledSectionTitle>
        <StyledTitleLarge>Account Settings</StyledTitleLarge>
      </StyledSectionTitle>

      <StyledSection>
        <StyledBodyLarge color={variables.palette.on_surface}>Profile</StyledBodyLarge>
        <StyledProfileSection>
          <StyledAvatarWrapper>
            <Avatar caption={userInitials} />
          </StyledAvatarWrapper>
        </StyledProfileSection>
      </StyledSection>

      <StyledSection>
        <StyledEmailSection>
          <Box>
            <StyledEmailLabel>Email</StyledEmailLabel>
            <StyledEmailText>{authData?.user?.email}</StyledEmailText>
          </Box>
        </StyledEmailSection>
      </StyledSection>

      <StyledDivider />

      <StyledSection>
        <StyledBodyMedium color={variables.palette.on_surface}>
          Two-factor authentication
        </StyledBodyMedium>
        <StyledTwoFactorDescription>
          Two-factor authentication (2FA) adds an additional layer of security to your account by
          requiring more than just a password to sign in. You may use one of the methods below:
        </StyledTwoFactorDescription>
        <StyledAuthenticatorRow>
          <StyledAuthenticatorIcon>
            <MobileIcon />
          </StyledAuthenticatorIcon>
          <StyledAuthenticatorInfo>
            <StyledAuthenticatorTitle>Authenticator app</StyledAuthenticatorTitle>
            <StyledAuthenticatorDescription>
              Use an authentication app or browser extension to get one time codes when prompted.
            </StyledAuthenticatorDescription>
          </StyledAuthenticatorInfo>
          <StyledChangeButton type="button">Add</StyledChangeButton>
        </StyledAuthenticatorRow>
      </StyledSection>

      <StyledDivider />

      <StyledSection>
        <StyledRecoveryOptionsHeader>Recovery options</StyledRecoveryOptionsHeader>
        <StyledAuthenticatorRow>
          <StyledAuthenticatorIcon className="disabled">
            <KeyIcon />
          </StyledAuthenticatorIcon>
          <StyledAuthenticatorInfo>
            <StyledRecoveryCodesTitle>Recovery codes</StyledRecoveryCodesTitle>
            <StyledAuthenticatorDescription className="disabled">
              Recovery codes can be used to access your account in the event you lose access to your
              device and cannot receive two-factor authentication codes.
            </StyledAuthenticatorDescription>
          </StyledAuthenticatorInfo>
          <StyledChangeButton type="button" disabled>
            View
          </StyledChangeButton>
        </StyledAuthenticatorRow>
      </StyledSection>
    </StyledTabContent>
  );
};
