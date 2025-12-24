import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Avatar, Svg } from 'shared/components';
import { auth, banners } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { StyledTitleLarge, StyledBodyMedium, StyledBodyLarge, variables } from 'shared/styles';
import { getUserDetailsApi } from 'modules/Dashboard/api';
import { useFeatureFlags } from 'shared/hooks';

import { MFASetup } from '../MFASetup';
import { ViewRecoveryCodes } from '../ViewRecoveryCodes';
import { RemoveMFA } from '../RemoveMFA';
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
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const authData = auth.useData();
  const userInitials = auth.useUserInitials();
  const { featureFlags } = useFeatureFlags();
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [showViewRecoveryCodes, setShowViewRecoveryCodes] = useState(false);
  const [showRemoveMFA, setShowRemoveMFA] = useState(false);
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
    // Show success banner
    dispatch(banners.actions.addBanner({ key: 'MFAEnabledSuccessBanner' }));
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
    setShowRemoveMFA(true);
  };

  const handleRemoveMFASuccess = () => {
    setIsMFAEnabled(false);
    dispatch(
      banners.actions.addBanner({
        key: 'MFARemovalSuccessBanner',
        bannerProps: {
          children: t('mfa.remove.successMessage'),
          severity: 'success',
        },
      }),
    );
  };

  const handleViewRecoveryCodes = () => {
    setShowViewRecoveryCodes(true);
  };

  return (
    <>
      <StyledTabContent>
        <StyledSectionTitle>
          <StyledTitleLarge>{t('mfa.accountSettings')}</StyledTitleLarge>
        </StyledSectionTitle>

        <StyledSection>
          <StyledBodyLarge color={variables.palette.on_surface}>{t('mfa.profile')}</StyledBodyLarge>
          <StyledProfileSection>
            <StyledAvatarWrapper>
              <Avatar caption={userInitials} />
            </StyledAvatarWrapper>
          </StyledProfileSection>
        </StyledSection>

        <StyledSection>
          <StyledEmailSection>
            <Box>
              <StyledEmailLabel>{t('mfa.email')}</StyledEmailLabel>
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
                {t('mfa.title')}
              </StyledBodyMedium>
              <StyledTwoFactorDescription>{t('mfa.description')}</StyledTwoFactorDescription>
              <StyledAuthenticatorRow>
                <StyledAuthenticatorIcon>
                  <Svg id="mobile" width={24} height={24} />
                </StyledAuthenticatorIcon>
                <StyledAuthenticatorInfo>
                  <StyledAuthenticatorTitle>
                    {t('mfa.authenticatorApp.title')}
                    {isMFAEnabled && (
                      <StyledEnabledBadge>
                        <Svg id="shield-check" width={18} height={18} />
                        <span>{t('mfa.enabled')}</span>
                      </StyledEnabledBadge>
                    )}
                  </StyledAuthenticatorTitle>
                  <StyledAuthenticatorDescription>
                    {t('mfa.authenticatorApp.description')}
                  </StyledAuthenticatorDescription>
                </StyledAuthenticatorInfo>
                <StyledChangeButton
                  type="button"
                  isRemove={isMFAEnabled}
                  onClick={isMFAEnabled ? handleRemoveMFA : () => setShowMFASetup(true)}
                >
                  {isMFAEnabled ? t('mfa.buttons.remove') : t('mfa.buttons.add')}
                </StyledChangeButton>
              </StyledAuthenticatorRow>
            </StyledSection>

            <StyledDivider />

            <StyledSection>
              <StyledRecoveryOptionsHeader sx={{ opacity: isMFAEnabled ? 1 : 0.38 }}>
                {t('mfa.recoveryOptions')}
              </StyledRecoveryOptionsHeader>
              <StyledAuthenticatorRow>
                <StyledAuthenticatorIcon className={isMFAEnabled ? '' : 'disabled'}>
                  <Svg id="key" width={24} height={24} />
                </StyledAuthenticatorIcon>
                <StyledAuthenticatorInfo>
                  <StyledRecoveryCodesTitle sx={{ opacity: isMFAEnabled ? 1 : 0.38 }}>
                    {t('mfa.recoveryCodes.title')}
                  </StyledRecoveryCodesTitle>
                  <StyledAuthenticatorDescription className={isMFAEnabled ? '' : 'disabled'}>
                    {t('mfa.recoveryCodes.description')}
                  </StyledAuthenticatorDescription>
                </StyledAuthenticatorInfo>
                <StyledChangeButton
                  type="button"
                  disabled={!isMFAEnabled}
                  onClick={handleViewRecoveryCodes}
                >
                  {t('mfa.buttons.view')}
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

      <ViewRecoveryCodes
        open={showViewRecoveryCodes}
        onClose={() => setShowViewRecoveryCodes(false)}
      />

      <RemoveMFA
        open={showRemoveMFA}
        onClose={() => setShowRemoveMFA(false)}
        onSuccess={handleRemoveMFASuccess}
      />
    </>
  );
};
