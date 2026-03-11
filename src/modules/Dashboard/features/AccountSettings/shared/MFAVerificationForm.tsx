import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MFAVerificationFormProps } from './MFAVerificationForm.types';

export const MFAVerificationForm = ({
  verificationCode,
  isLoading,
  error,
  onInputChange,
  onPrimaryAction,
  onSecondaryAction,
  primaryButtonText = 'Continue',
  secondaryButtonText = 'Back',
  inputWidth = '300px',
  StyledInputContainer,
  StyledInput,
  StyledButtonContainer,
  StyledButton,
  StyledErrorMessage,
}: MFAVerificationFormProps) => {
  const { t } = useTranslation('app');
  // Cast to any to avoid TypeScript prop forwarding issues with transient props
  const InputContainer = StyledInputContainer as any;

  return (
    <>
      <Box sx={{ width: inputWidth, position: 'relative' }}>
        <InputContainer $hasError={!!error}>
          <StyledInput
            type="text"
            inputMode="numeric"
            placeholder={t('mfa.verificationCode.placeholder')}
            value={verificationCode}
            onChange={onInputChange}
            maxLength={6}
            disabled={isLoading}
          />
        </InputContainer>
        {error && <StyledErrorMessage>{t(error, { defaultValue: error })}</StyledErrorMessage>}
      </Box>

      <StyledButtonContainer>
        <StyledButton type="button" className="primary" onClick={onPrimaryAction}>
          {isLoading ? t('mfa.buttons.verifying') : primaryButtonText}
        </StyledButton>
        <StyledButton
          type="button"
          className="secondary"
          onClick={onSecondaryAction}
          disabled={isLoading}
        >
          {secondaryButtonText}
        </StyledButton>
      </StyledButtonContainer>
    </>
  );
};
