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
  verificationCode,
  setVerificationCode,
  isLoading,
  error,
  clearError,
  title,
  description,
}: ConfirmIdentityVerificationCodeProps) => {
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
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={handleInputChange}
              maxLength={6}
              disabled={isLoading}
            />
          </StyledInputContainer>
          {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
        </Box>

        <StyledButtonContainer>
          <StyledButton
            type="button"
            className="primary"
            onClick={handleContinue}
            disabled={isLoading}
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
