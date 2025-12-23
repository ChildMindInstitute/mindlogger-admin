import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmIdentityVerificationCode, ConfirmIdentityRecoveryCode } from '../shared';
import { RemoveMFAConfirmation } from './RemoveMFAConfirmation';
import { RemoveMFAProps } from './RemoveMFA.types';
import { useRemoveMFA } from './useRemoveMFA';

type RemoveStep = 'verification' | 'recovery-code' | 'confirmation';

export const RemoveMFA = ({ open, onClose, onSuccess }: RemoveMFAProps) => {
  const { t } = useTranslation('app');
  const [currentStep, setCurrentStep] = useState<RemoveStep>('verification');
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');

  const { mfaToken, isLoading, error, clearError, initiateDisable, verifyAndDisable } =
    useRemoveMFA();

  // Initiate MFA disable when modal opens
  useEffect(() => {
    if (open && !mfaToken) {
      initiateDisable();
    }
  }, [open, mfaToken, initiateDisable]);

  const handleVerificationConfirm = async (code: string) => {
    const result = await verifyAndDisable(code);

    if (result.success) {
      setCurrentStep('confirmation');
    }
  };

  const handleRecoveryCodeConfirm = async (code: string) => {
    const result = await verifyAndDisable(code);

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

  const handleFinalConfirm = async () => {
    onSuccess();
    handleClose();
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
