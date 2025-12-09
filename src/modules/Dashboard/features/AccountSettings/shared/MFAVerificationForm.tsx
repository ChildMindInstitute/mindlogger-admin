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
}: MFAVerificationFormProps) => (
  <>
    <Box sx={{ width: inputWidth, position: 'relative' }}>
      <StyledInputContainer hasError={!!error}>
        <StyledInput
          type="text"
          inputMode="numeric"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={onInputChange}
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
