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
  verificationCode,
  setVerificationCode,
  isLoading,
  error,
  clearError,
}: ConfirmIdentityVerificationCodeProps) => {
  const { handleInputChange } = useMFAInputHandler(setVerificationCode, clearError, error);

  const handleClose = () => {
    // Remove focus from any focused element before closing to prevent aria-hidden focus warning
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

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth={false} disableRestoreFocus>
      <StyledHeader>
        <StyledTitle>Confirm Your Identity</StyledTitle>
      </StyledHeader>

      <StyledContent>
        <StyledDescription>
          To view the recovery codes for your account, we first have confirm it's you. Please enter
          the verification code from your authenticator app.
        </StyledDescription>

        <StyledInputContainer $hasError={!!error}>
          <StyledInput
            type="text"
            inputMode="numeric"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={handleInputChange}
            maxLength={6}
            disabled={isLoading}
          />
        </StyledInputContainer>
        {error && <StyledErrorMessage>{error}</StyledErrorMessage>}

        <StyledButtonContainer>
          <StyledButton
            type="button"
            className="primary"
            onClick={handleContinue}
            disabled={isLoading || !verificationCode}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </StyledButton>
          <StyledButton
            type="button"
            className="secondary"
            onClick={handleUseRecoveryCode}
            disabled={isLoading}
          >
            I can't access my authenticator app
          </StyledButton>
        </StyledButtonContainer>
      </StyledContent>
    </StyledDialog>
  );
};
