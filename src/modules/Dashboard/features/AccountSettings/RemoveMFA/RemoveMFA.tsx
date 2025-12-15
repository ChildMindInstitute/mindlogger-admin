import { useState } from 'react';

import { ConfirmIdentityVerificationCode, ConfirmIdentityRecoveryCode } from '../shared';
import { RemoveMFAConfirmation } from './RemoveMFAConfirmation';
import { RemoveMFAProps } from './RemoveMFA.types';

type RemoveStep = 'verification' | 'recovery-code' | 'confirmation';

export const RemoveMFA = ({ open, onClose, onSuccess }: RemoveMFAProps) => {
  const [currentStep, setCurrentStep] = useState<RemoveStep>('verification');
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleVerificationConfirm = async (_code: string) => {
    // TODO: API call to verify TOTP code for MFA removal
    setIsLoading(true);
    clearError();
    
    // Simulate API call for now
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('confirmation');
    }, 500);
  };

  const handleRecoveryCodeConfirm = async (_code: string) => {
    // TODO: API call to verify recovery code for MFA removal
    setIsLoading(true);
    clearError();
    
    // Simulate API call for now
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('confirmation');
    }, 500);
  };

  const handleFinalConfirm = async () => {
    // TODO: API call to actually remove MFA
    setIsLoading(true);
    
    // Simulate API call for now
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
      handleClose();
    }, 500);
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
        title="Confirm Your Identity"
        description="To remove two factor authentication from your account, we first need to confirm it's you. Please enter the verification code from your authenticator app."
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
