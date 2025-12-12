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
import { CloseIcon } from './CloseIcon';

export const ConfirmIdentityRecoveryCode = ({
  open,
  onClose,
  onConfirm,
  onBack,
  recoveryCode,
  setRecoveryCode,
  isLoading,
  error,
}: ConfirmIdentityRecoveryCodeProps) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Allow only alphanumeric characters and dash
    const sanitized = value.replace(/[^A-Z0-9-]/g, '');
    setRecoveryCode(sanitized);
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth={false} disableRestoreFocus>
      <StyledHeader>
        <StyledTitle>Confirm Your Identity</StyledTitle>
        <StyledCloseButton type="button" onClick={handleClose}>
          <CloseIcon />
        </StyledCloseButton>
      </StyledHeader>

      <StyledContent>
        <StyledDescription>Please enter an account recovery code.</StyledDescription>

        <StyledInputContainer $hasError={!!error}>
          <StyledInput
            type="text"
            placeholder="XXXXX-XXXXX"
            value={recoveryCode}
            onChange={handleInputChange}
            maxLength={11}
            disabled={isLoading}
          />
        </StyledInputContainer>
        {error && <StyledErrorMessage>{error}</StyledErrorMessage>}

        <StyledButtonContainer>
          <StyledButton
            type="button"
            className="primary"
            onClick={handleContinue}
            disabled={isLoading || !recoveryCode}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </StyledButton>
          <StyledButton
            type="button"
            className="secondary"
            onClick={handleBack}
            disabled={isLoading}
          >
            Back
          </StyledButton>
        </StyledButtonContainer>
      </StyledContent>
    </StyledDialog>
  );
};
