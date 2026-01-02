import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmIdentityVerificationCode, ConfirmIdentityRecoveryCode } from '../shared';
import { RemoveMFAConfirmation } from './RemoveMFAConfirmation';
import { RemoveMFAProps } from './RemoveMFA.types';
import { useRemoveMFA } from './useRemoveMFA';
import { ErrorScenario } from './RemoveMFA.types';

type RemoveStep = 'verification' | 'recovery-code' | 'confirmation';

export const RemoveMFA = ({ open, onClose, onSuccess }: RemoveMFAProps) => {
  const { t } = useTranslation('app');
  const [currentStep, setCurrentStep] = useState<RemoveStep>('verification');
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');

  const {
    mfaToken,
    isLoading,
    error,
    errorScenario,
    clearError,
    resetSession,
    initiateDisable,
    verifyCode,
    confirmDisable,
  } = useRemoveMFA();

  const shouldShowRetry =
    errorScenario === ErrorScenario.SESSION_EXPIRED ||
    errorScenario === ErrorScenario.MAX_SESSION_ATTEMPTS;

  useEffect(() => {
    if (open && !mfaToken) {
      initiateDisable();
    }
  }, [open, mfaToken, initiateDisable]);

  // Reset session when modal closes
  useEffect(() => {
    if (!open) {
      resetSession();
      setCurrentStep('verification');
      setVerificationCode('');
      setRecoveryCode('');
    }
  }, [open, resetSession]);

  const handleVerificationConfirm = async (code: string) => {
    const result = await verifyCode(code);

    if (result.success) {
      setCurrentStep('confirmation');
    }
  };

  const handleRecoveryCodeConfirm = async (code: string) => {
    const result = await verifyCode(code);

    if (result.success) {
      setCurrentStep('confirmation');
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

  const handleRetry = async () => {
    resetSession();
    setVerificationCode('');
    setRecoveryCode('');
    await initiateDisable();
  };

  const handleFinalConfirm = async () => {
    const result = await confirmDisable();

    if (result.success) {
      onSuccess();
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep('verification');
    setVerificationCode('');
    setRecoveryCode('');
    clearError();
    onClose();
  };

  return (
    <>
      <ConfirmIdentityVerificationCode
        open={open && currentStep === 'verification'}
        onClose={handleClose}
        onConfirm={handleVerificationConfirm}
        onUseRecoveryCode={handleUseRecoveryCode}
        onRetry={shouldShowRetry ? handleRetry : undefined}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isLoading={isLoading}
        error={error}
        clearError={clearError}
        title={t('mfa.confirmIdentity.title')}
        description={t('mfa.confirmIdentity.removeDescription')}
      />

      <ConfirmIdentityRecoveryCode
        open={open && currentStep === 'recovery-code'}
        onClose={handleClose}
        onConfirm={handleRecoveryCodeConfirm}
        onBack={handleBackToVerification}
        onRetry={shouldShowRetry ? handleRetry : undefined}
        recoveryCode={recoveryCode}
        setRecoveryCode={setRecoveryCode}
        isLoading={isLoading}
        error={error}
      />

      <RemoveMFAConfirmation
        open={open && currentStep === 'confirmation'}
        onClose={handleClose}
        onConfirm={handleFinalConfirm}
        isLoading={isLoading}
      />
    </>
  );
};
