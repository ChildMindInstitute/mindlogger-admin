import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import {
  StyledDialog,
  StyledHeader,
  StyledTitle,
  StyledContent,
  StyledDescription,
  StyledInputContainer,
  StyledInput,
  StyledButtonContainer,
  StyledButton,
  StyledErrorMessage,
} from './ConfirmIdentityVerificationCode.styles';
import { ConfirmIdentityVerificationCodeProps } from './ConfirmIdentityVerificationCode.types';
import { useMFAInputHandler } from './useMFAInputHandler';

export const ConfirmIdentityVerificationCode = ({
  open,
  onClose,
  onConfirm,
  onUseRecoveryCode,
  onRetry,
  verificationCode,
  setVerificationCode,
  isLoading,
  error,
  clearError,
  title,
  description,
}: ConfirmIdentityVerificationCodeProps) => {
  const { t } = useTranslation('app');
  const { handleInputChange } = useMFAInputHandler(setVerificationCode, clearError, error);

  const handleClose = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  const handleContinue = () => {
    onConfirm(verificationCode);
  };

  const handleUseRecoveryCode = () => {
    onUseRecoveryCode();
  };

  const handleTryAgain = () => {
    if (onRetry) {
      onRetry();
    }
  };

  // Disable input for critical error scenarios
  const shouldDisableInput = !!onRetry;

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth={false} disableRestoreFocus>
      <StyledHeader>
        <StyledTitle>{title}</StyledTitle>
      </StyledHeader>

      <StyledContent>
        <StyledDescription>{description}</StyledDescription>

        <Box sx={{ width: '300px', position: 'relative' }}>
          <StyledInputContainer $hasError={!!error}>
            <StyledInput
              type="text"
              inputMode="numeric"
              placeholder={t('mfa.verificationCode.placeholder')}
              value={verificationCode}
              onChange={handleInputChange}
              maxLength={6}
              disabled={isLoading || shouldDisableInput}
            />
          </StyledInputContainer>
          {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
        </Box>

        <StyledButtonContainer>
          {onRetry ? (
            <StyledButton
              type="button"
              className="primary"
              onClick={handleTryAgain}
              disabled={isLoading}
            >
              {t('mfa.buttons.tryAgain')}
            </StyledButton>
          ) : (
            <>
              <StyledButton
                type="button"
                className="primary"
                onClick={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? t('mfa.buttons.verifying') : t('mfa.buttons.continue')}
              </StyledButton>
              <StyledButton
                type="button"
                className="secondary"
                onClick={handleUseRecoveryCode}
                disabled={isLoading}
              >
                {t('mfa.confirmIdentity.cantAccessApp')}
              </StyledButton>
            </>
          )}
        </StyledButtonContainer>
      </StyledContent>
    </StyledDialog>
  );
};
