import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg } from 'shared/components/Svg';

import {
  StyledDialog,
  StyledHeader,
  StyledTitle,
  StyledCloseButton,
  StyledContent,
  StyledDescription,
  StyledInputContainer,
  StyledInput,
  StyledButtonContainer,
  StyledButton,
  StyledErrorMessage,
} from './ConfirmIdentityRecoveryCode.styles';
import { ConfirmIdentityRecoveryCodeProps } from './ConfirmIdentityRecoveryCode.types';

export const ConfirmIdentityRecoveryCode = ({
  open,
  onClose,
  onConfirm,
  onBack,
  onRetry,
  recoveryCode,
  setRecoveryCode,
  isLoading,
  error,
}: ConfirmIdentityRecoveryCodeProps) => {
  const { t } = useTranslation('app');

  const handleClose = () => {
    // Remove focus from any focused element before closing to prevent aria-hidden focus warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  const handleContinue = () => {
    onConfirm(recoveryCode);
  };

  const handleBack = () => {
    onBack();
  };

  const handleTryAgain = () => {
    if (onRetry) {
      onRetry();
    }
  };

  // Disable input for critical error scenarios
  const shouldDisableInput = !!onRetry;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Allow only alphanumeric characters and dash
    const sanitized = value.replace(/[^A-Z0-9-]/g, '');

    // Auto-insert hyphen after 5 characters (format: XXXXX-XXXXX)
    if (sanitized.length === 5 && !sanitized.includes('-')) {
      setRecoveryCode(`${sanitized}-`);
    } else if (sanitized.length === 6 && sanitized.charAt(5) !== '-') {
      // If user pastes or types through, ensure hyphen is at position 5
      setRecoveryCode(`${sanitized.slice(0, 5)}-${sanitized.slice(5)}`);
    } else {
      setRecoveryCode(sanitized);
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth={false} disableRestoreFocus>
      <StyledHeader>
        <StyledTitle>{t('mfa.confirmIdentity.title')}</StyledTitle>
        <StyledCloseButton type="button" onClick={handleClose}>
          <Svg id="close" width={24} height={24} />
        </StyledCloseButton>
      </StyledHeader>

      <StyledContent>
        <StyledDescription>{t('mfa.confirmIdentity.recoveryDescription')}</StyledDescription>

        <Box sx={{ width: '300px', position: 'relative' }}>
          <StyledInputContainer $hasError={!!error}>
            <StyledInput
              type="text"
              placeholder={t('mfa.recoveryCodes.placeholder')}
              value={recoveryCode}
              onChange={handleInputChange}
              maxLength={11}
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
                onClick={handleBack}
                disabled={isLoading}
              >
                {t('mfa.buttons.back')}
              </StyledButton>
            </>
          )}
        </StyledButtonContainer>
      </StyledContent>
    </StyledDialog>
  );
};
