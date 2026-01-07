import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledBodyMedium, variables } from 'shared/styles';

import { MFASetup } from '../MFASetup';
import { ViewRecoveryCodes } from '../ViewRecoveryCodes';
import { RemoveMFA } from '../RemoveMFA';
import {
  StyledSection,
  StyledDivider,
  StyledChangeButton,
  StyledAuthenticatorRow,
  StyledAuthenticatorContent,
  StyledAuthenticatorInfo,
  StyledAuthenticatorIcon,
  StyledTwoFactorDescription,
  StyledAuthenticatorTitle,
  StyledAuthenticatorDescription,
  StyledRecoveryOptionsHeader,
  StyledRecoveryCodesTitle,
  StyledEnabledBadge,
} from './AccountTab.styles';

interface MFASectionProps {
  isMFAEnabled: boolean;
  setIsMFAEnabled: (enabled: boolean) => void;
  refetchMFAStatus: () => Promise<void>;
  isModalOpen: boolean;
  onShowBanner: (message: string) => void;
}

export const MFASection = ({
  isMFAEnabled,
  setIsMFAEnabled,
  refetchMFAStatus,
  isModalOpen,
  onShowBanner,
}: MFASectionProps) => {
  const { t } = useTranslation('app');
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [showViewRecoveryCodes, setShowViewRecoveryCodes] = useState(false);
  const [showRemoveMFA, setShowRemoveMFA] = useState(false);

  // Refetch MFA status when setup modal closes to ensure UI is in sync with backend
  // This handles race conditions where backend state changed but UI didn't update
  useEffect(() => {
    if (!showMFASetup && isModalOpen) {
      // Small delay to ensure any pending API calls complete
      const timeoutId = setTimeout(refetchMFAStatus, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [showMFASetup, isModalOpen, refetchMFAStatus]);

  const handleMFASetupComplete = () => {
    setShowMFASetup(false);
    setIsMFAEnabled(true);
    // Show inline success banner
    onShowBanner(t('mfa.enabled.successMessage'));
  };

  const handleRemoveMFA = () => {
    setShowRemoveMFA(true);
  };

  const handleRemoveMFASuccess = () => {
    setIsMFAEnabled(false);
    // Show inline success banner
    onShowBanner(t('mfa.remove.successMessage'));
  };

  const handleViewRecoveryCodes = () => {
    setShowViewRecoveryCodes(true);
  };

  return (
    <>
      <StyledSection>
        <StyledBodyMedium color={variables.palette.on_surface}>{t('mfa.title')}</StyledBodyMedium>
        <StyledTwoFactorDescription>{t('mfa.description')}</StyledTwoFactorDescription>
        <StyledAuthenticatorRow>
          <StyledAuthenticatorContent>
            <StyledAuthenticatorIcon>
              <Svg id="mobile" width={24} height={24} />
            </StyledAuthenticatorIcon>
            <StyledAuthenticatorInfo>
              <StyledAuthenticatorTitle>
                {t('mfa.authenticatorApp.title')}
                {isMFAEnabled && (
                  <StyledEnabledBadge>
                    <Svg id="shield-check" width={18} height={18} />
                    <span>{t('mfa.enabledBadge')}</span>
                  </StyledEnabledBadge>
                )}
              </StyledAuthenticatorTitle>
              <StyledAuthenticatorDescription>
                {t('mfa.authenticatorApp.description')}
              </StyledAuthenticatorDescription>
            </StyledAuthenticatorInfo>
          </StyledAuthenticatorContent>
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
          <StyledAuthenticatorContent>
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
          </StyledAuthenticatorContent>
          <StyledChangeButton
            type="button"
            disabled={!isMFAEnabled}
            onClick={handleViewRecoveryCodes}
          >
            {t('mfa.buttons.view')}
          </StyledChangeButton>
        </StyledAuthenticatorRow>
      </StyledSection>

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
