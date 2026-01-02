import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal } from 'shared/components/Modal';

import { ConfirmIdentityVerificationCode, ConfirmIdentityRecoveryCode } from '../shared';
import { MFARecoveryCodes } from '../MFARecoveryCodes/MFARecoveryCodes';
import { ViewRecoveryCodesProps } from './ViewRecoveryCodes.types';
import { useViewRecoveryCodes } from './useViewRecoveryCodes';
import { ErrorScenario } from './ViewRecoveryCodes.types';

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
    errorScenario,
    errorMetadata: _errorMetadata, // Future use: showing attempt counts
    clearError,
    handleVerifyCode,
    handleVerifyRecoveryCode,
    initiateSession,
    sessionInitialized,
    resetSession,
  } = useViewRecoveryCodes();

  // Disable input when max attempts reached or session expired
  const shouldDisableInput =
    errorScenario === ErrorScenario.SESSION_EXPIRED ||
    errorScenario === ErrorScenario.MAX_SESSION_ATTEMPTS ||
    errorScenario === ErrorScenario.GLOBAL_LOCKOUT;

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
    // Reset all state and close
    setCurrentStep('verification');
    resetSession();
    onClose();
  };

  const handleTryAgain = () => {
    // Close modal - user can click "View" again to restart
    handleClose();
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
        onRetry={shouldDisableInput ? handleTryAgain : undefined}
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
        onRetry={shouldDisableInput ? handleTryAgain : undefined}
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

      <Modal
        open={open && errorScenario === ErrorScenario.GLOBAL_LOCKOUT}
        onClose={handleClose}
        title={t('mfa.lockout.title')}
        buttonText={t('mfa.lockout.okButton')}
        onSubmit={handleClose}
        width="50"
      >
        <Box sx={{ px: 3.2, py: 2.4, lineHeight: 1.6, fontSize: '1.4rem' }}>
          {t('mfa.lockout.message')}
        </Box>
      </Modal>
    </>
  );
};
