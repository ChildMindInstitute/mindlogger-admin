import { Box } from '@mui/material';

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
  // Cast to any to avoid TypeScript prop forwarding issues with transient props
  const InputContainer = StyledInputContainer as any;

  return (
    <>
      <Box sx={{ width: inputWidth, position: 'relative' }}>
        <InputContainer $hasError={!!error}>
          <StyledInput
            type="text"
            inputMode="numeric"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={onInputChange}
            maxLength={6}
            disabled={isLoading}
          />
        </InputContainer>
        {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
      </Box>

      <StyledButtonContainer>
        <StyledButton
          type="button"
          className="primary"
          onClick={onPrimaryAction}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : primaryButtonText}
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
