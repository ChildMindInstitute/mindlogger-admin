import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmIdentityVerificationCode, ConfirmIdentityRecoveryCode } from '../shared';
import { MFARecoveryCodes } from '../MFARecoveryCodes/MFARecoveryCodes';
import { ViewRecoveryCodesProps } from './ViewRecoveryCodes.types';
import { useViewRecoveryCodes } from './useViewRecoveryCodes';

type ViewStep = 'verification' | 'recovery-code' | 'codes';

export const ViewRecoveryCodes = ({ open, onClose }: ViewRecoveryCodesProps) => {
  const { t } = useTranslation('app');
  const [currentStep, setCurrentStep] = useState<ViewStep>('verification');
  const {
    verificationCode,
    setVerificationCode,
    recoveryCode,
    setRecoveryCode,
    recoveryCodes,
    downloadToken,
    isLoading,
    error,
    clearError,
    handleVerifyCode,
    handleVerifyRecoveryCode,
    initiateSession,
    sessionInitialized,
    resetSession,
  } = useViewRecoveryCodes();

  // Initiate MFA session when modal opens
  useEffect(() => {
    if (open && !sessionInitialized) {
      initiateSession();
    }
  }, [open, initiateSession, sessionInitialized]);

  const handleVerificationConfirm = async (code: string) => {
    const result = await handleVerifyCode(code);
    if (result.success && result.recoveryCodes) {
      setCurrentStep('codes');
    }
  };

  const handleRecoveryCodeConfirm = async (code: string) => {
    const result = await handleVerifyRecoveryCode(code);
    if (result.success && result.recoveryCodes) {
      setCurrentStep('codes');
    }
  };

  const handleUseRecoveryCode = () => {
    clearError();
    setCurrentStep('recovery-code');
  };

  const handleBackToVerification = () => {
    clearError();
    setCurrentStep('verification');
  };

  const handleClose = () => {
    // Reset all state including session
    setCurrentStep('verification');
    resetSession();
    onClose();
  };

  const handleCodesConfirm = () => {
    handleClose();
  };

  return (
    <>
      <ConfirmIdentityVerificationCode
        open={open && currentStep === 'verification'}
        onClose={handleClose}
        onConfirm={handleVerificationConfirm}
        onUseRecoveryCode={handleUseRecoveryCode}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isLoading={isLoading}
        error={error}
        clearError={clearError}
        title={t('mfa.confirmIdentity.title')}
        description={t('mfa.confirmIdentity.verificationDescription')}
      />

      <ConfirmIdentityRecoveryCode
        open={open && currentStep === 'recovery-code'}
        onClose={handleClose}
        onConfirm={handleRecoveryCodeConfirm}
        onBack={handleBackToVerification}
        recoveryCode={recoveryCode}
        setRecoveryCode={setRecoveryCode}
        isLoading={isLoading}
        error={error}
      />

      {recoveryCodes && (
        <MFARecoveryCodes
          open={open && currentStep === 'codes'}
          onClose={handleClose}
          recoveryCodes={recoveryCodes}
          downloadToken={downloadToken ?? undefined}
          onConfirm={handleCodesConfirm}
        />
      )}
    </>
  );
};
