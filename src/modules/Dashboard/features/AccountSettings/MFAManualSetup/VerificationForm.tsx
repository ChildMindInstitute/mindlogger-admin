import { useTranslation } from 'react-i18next';

import {
  StyledInputContainer,
  StyledInput,
  StyledButtonContainer,
  StyledButton,
  StyledErrorMessage,
} from './MFAManualSetup.styles';
import { VerificationFormProps } from './VerificationForm.types';
import { MFAVerificationForm } from '../shared/MFAVerificationForm';

export const VerificationForm = ({
  verificationCode,
  isLoading,
  error,
  onInputChange,
  onContinue,
  onBack,
}: VerificationFormProps) => {
  const { t } = useTranslation('app');

  return (
    <MFAVerificationForm
      verificationCode={verificationCode}
      isLoading={isLoading}
      error={error}
      onInputChange={onInputChange}
      onPrimaryAction={onContinue}
      onSecondaryAction={onBack}
      primaryButtonText={t('mfa.buttons.continue')}
      secondaryButtonText={t('mfa.buttons.back')}
      inputWidth="300px"
      StyledInputContainer={StyledInputContainer}
      StyledInput={StyledInput}
      StyledButtonContainer={StyledButtonContainer}
      StyledButton={StyledButton}
      StyledErrorMessage={StyledErrorMessage}
    />
  );
};
