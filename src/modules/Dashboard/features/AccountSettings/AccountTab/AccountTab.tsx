import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

import { Avatar } from 'shared/components';
import { auth } from 'redux/modules';
import { StyledTitleLarge, StyledBodyMedium, StyledBodyLarge, variables } from 'shared/styles';
import { getUserDetailsApi } from 'modules/Dashboard/api';
import { useFeatureFlags } from 'shared/hooks';

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

interface AccountTabProps {
  isModalOpen: boolean;
}

export const AccountTab = ({ isModalOpen }: AccountTabProps) => {
  // const { t } = useTranslation('app');
  const authData = auth.useData();
  const userInitials = auth.useUserInitials();
  const { featureFlags } = useFeatureFlags();
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [_isLoadingMFAStatus, setIsLoadingMFAStatus] = useState(true);

  // Fetch MFA status whenever modal opens
  useEffect(() => {
    if (!isModalOpen) return;

    const fetchMFAStatus = async () => {
      setIsLoadingMFAStatus(true);
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
  }, [isModalOpen]);

  const handleMFASetupComplete = () => {
    setShowMFASetup(false);
    setIsMFAEnabled(true);
  };

  // Refetch MFA status when setup modal closes to ensure UI is in sync with backend
  // This handles race conditions where backend state changed but UI didn't update
  useEffect(() => {
    if (!showMFASetup && isModalOpen) {
      const refetchMFAStatus = async () => {
        try {
          const response = await getUserDetailsApi();
          const userData = response.data.result;
          setIsMFAEnabled(userData.mfaEnabled || false);
        } catch (error) {
          console.error('Failed to refetch MFA status:', error);
        }
      };

      // Small delay to ensure any pending API calls complete
      const timeoutId = setTimeout(refetchMFAStatus, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [showMFASetup, isModalOpen]);

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

        {/* Two-Factor Authentication Section - Feature Flagged */}
        {featureFlags.enableMfa && (
          <>
            <StyledSection>
              <StyledBodyMedium color={variables.palette.on_surface}>
                Two-factor authentication
              </StyledBodyMedium>
              <StyledTwoFactorDescription>
                Two-factor authentication (2FA) adds an additional layer of security to your account
                by by by by requiring more than just a password to sign in. You may use one of the
                below:
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
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.63 3.64982C19.5138 3.55584 19.3781 3.48909 19.2327 3.45448C19.0873 3.41987 18.9361 3.41828 18.79 3.44982C17.7214 3.67376 16.6183 3.67662 15.5486 3.4582C14.4789 3.23979 13.4653 2.80473 12.57 2.17982C12.4026 2.06369 12.2037 2.00146 12 2.00146C11.7963 2.00146 11.5974 2.06369 11.43 2.17982C10.5348 2.80473 9.52108 3.23979 8.45137 3.4582C7.38166 3.67662 6.27857 3.67376 5.21001 3.44982C5.06394 3.41828 4.91267 3.41987 4.76731 3.45448C4.62194 3.48909 4.48618 3.55584 4.37001 3.64982C4.25399 3.74394 4.16053 3.86286 4.0965 3.99784C4.03247 4.13282 3.9995 4.28043 4.00001 4.42982V11.8798C3.99912 13.3136 4.34078 14.7268 4.99654 16.0018C5.6523 17.2768 6.60319 18.3767 7.77001 19.2098L11.42 21.8098C11.5894 21.9304 11.7921 21.9952 12 21.9952C12.2079 21.9952 12.4106 21.9304 12.58 21.8098L16.23 19.2098C17.3968 18.3767 18.3477 17.2768 19.0035 16.0018C19.6592 14.7268 20.0009 13.3136 20 11.8798V4.42982C20.0005 4.28043 19.9675 4.13282 19.9035 3.99784C19.8395 3.86286 19.746 3.74394 19.63 3.64982ZM18 11.8798C18.0008 12.9946 17.7353 14.0934 17.2257 15.0848C16.716 16.0763 15.977 16.9317 15.07 17.5798L12 19.7698L8.93001 17.5798C8.02304 16.9317 7.28399 16.0763 6.77435 15.0848C6.26472 14.0934 5.99924 12.9946 6.00001 11.8798V5.57982C8.09643 5.75925 10.196 5.27284 12 4.18982C13.804 5.27284 15.9036 5.75925 18 5.57982V11.8798ZM13.54 9.58982L10.85 12.2898L9.96001 11.3898C9.7717 11.2015 9.51631 11.0957 9.25001 11.0957C8.9837 11.0957 8.72831 11.2015 8.54001 11.3898C8.3517 11.5781 8.24591 11.8335 8.24591 12.0998C8.24591 12.3661 8.3517 12.6215 8.54001 12.8098L10.14 14.4098C10.233 14.5035 10.3436 14.5779 10.4654 14.6287C10.5873 14.6795 10.718 14.7056 10.85 14.7056C10.982 14.7056 11.1127 14.6795 11.2346 14.6287C11.3564 14.5779 11.467 14.5035 11.56 14.4098L15 10.9998C15.1883 10.8115 15.2941 10.5561 15.2941 10.2898C15.2941 10.0235 15.1883 9.76812 15 9.57982C14.8117 9.39152 14.5563 9.28573 14.29 9.28573C14.0237 9.28573 13.7683 9.39152 13.58 9.57982L13.54 9.58982Z"
                            fill="#1D1B19"
                          />
                        </svg>
                        <span>Enabled</span>
                      </StyledEnabledBadge>
                    )}
                  </StyledAuthenticatorTitle>
                  <StyledAuthenticatorDescription>
                    Use an authentication app or browser extension to get one time codes when
                    prompted.
                  </StyledAuthenticatorDescription>
                </StyledAuthenticatorInfo>
                <StyledChangeButton
                  type="button"
                  isRemove={isMFAEnabled}
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
                    Recovery codes can be used to access your account in the event you lose access
                    to your device and cannot receive two-factor authentication codes.
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
          </>
        )}
      </StyledTabContent>

      <MFASetup
        open={showMFASetup}
        onClose={() => setShowMFASetup(false)}
        onComplete={handleMFASetupComplete}
      />
    </>
  );
};
