import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

import { Avatar } from 'shared/components';
import { auth } from 'redux/modules';
import { StyledTitleLarge, StyledBodyMedium, StyledBodyLarge, variables } from 'shared/styles';
import { getUserDetailsApi } from 'modules/Dashboard/api';

import { MFASetup } from '../MFASetup';
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
  StyledEnabledBadge,
} from './AccountTab.styles';

export const AccountTab = () => {
  // const { t } = useTranslation('app');
  const authData = auth.useData();
  const userInitials = auth.useUserInitials();
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [_isLoadingMFAStatus, setIsLoadingMFAStatus] = useState(true);

  // Fetch MFA status on mount
  useEffect(() => {
    const fetchMFAStatus = async () => {
      try {
        const response = await getUserDetailsApi();
        const userData = response.data.result;
        setIsMFAEnabled(userData.mfaEnabled || false);
      } catch (error) {
        console.error('Failed to fetch MFA status:', error);
        // Fallback to false if fetch fails
        setIsMFAEnabled(false);
      } finally {
        setIsLoadingMFAStatus(false);
      }
    };

    fetchMFAStatus();
  }, []);

  const handleMFASetupComplete = () => {
    setShowMFASetup(false);
    setIsMFAEnabled(true);
  };

  const handleRemoveMFA = () => {
    // TODO: Implement MFA removal
  };

  const handleViewRecoveryCodes = () => {
    // TODO: Implement view recovery codes
  };

  return (
    <>
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
              <StyledAuthenticatorTitle>
                Authenticator app
                {isMFAEnabled && (
                  <StyledEnabledBadge>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM6.4 11.2L3.2 8L4.32 6.88L6.4 8.96L11.68 3.68L12.8 4.8L6.4 11.2Z"
                        fill="#484744"
                      />
                    </svg>
                    <span>Enabled</span>
                  </StyledEnabledBadge>
                )}
              </StyledAuthenticatorTitle>
              <StyledAuthenticatorDescription>
                Use an authentication app or browser extension to get one time codes when prompted.
              </StyledAuthenticatorDescription>
            </StyledAuthenticatorInfo>
            <StyledChangeButton
              type="button"
              onClick={isMFAEnabled ? handleRemoveMFA : () => setShowMFASetup(true)}
            >
              {isMFAEnabled ? 'Remove' : 'Add'}
            </StyledChangeButton>
          </StyledAuthenticatorRow>
        </StyledSection>

        <StyledDivider />

        <StyledSection>
          <StyledRecoveryOptionsHeader sx={{ opacity: isMFAEnabled ? 1 : 0.38 }}>
            Recovery options
          </StyledRecoveryOptionsHeader>
          <StyledAuthenticatorRow>
            <StyledAuthenticatorIcon className={isMFAEnabled ? '' : 'disabled'}>
              <KeyIcon />
            </StyledAuthenticatorIcon>
            <StyledAuthenticatorInfo>
              <StyledRecoveryCodesTitle sx={{ opacity: isMFAEnabled ? 1 : 0.38 }}>
                Recovery codes
              </StyledRecoveryCodesTitle>
              <StyledAuthenticatorDescription className={isMFAEnabled ? '' : 'disabled'}>
                Recovery codes can be used to access your account in the event you lose access to
                your device and cannot receive two-factor authentication codes.
              </StyledAuthenticatorDescription>
            </StyledAuthenticatorInfo>
            <StyledChangeButton
              type="button"
              disabled={!isMFAEnabled}
              onClick={handleViewRecoveryCodes}
            >
              View
            </StyledChangeButton>
          </StyledAuthenticatorRow>
        </StyledSection>
      </StyledTabContent>

      <MFASetup
        open={showMFASetup}
        onClose={() => setShowMFASetup(false)}
        onComplete={handleMFASetupComplete}
      />
    </>
  );
};
