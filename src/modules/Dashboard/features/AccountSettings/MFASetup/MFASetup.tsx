import { CircularProgress, Box } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

import {
  StyledDialog,
  StyledHeader,
  StyledTitle,
  StyledCloseButton,
  StyledContent,
  StyledDescription,
  StyledQRCodeContainer,
  StyledInputContainer,
  StyledInput,
  StyledButtonContainer,
  StyledButton,
  StyledErrorMessage,
  StyledLoadingContainer,
} from './MFASetup.styles';
import { MFASetupProps } from './MFASetup.types';
import { useMFASetup } from './useMFASetup';

export const MFASetup = ({ open, onClose, onComplete }: MFASetupProps) => {
  const {
    provisioningUri,
    verificationCode,
    isLoading,
    error,
    setVerificationCode,
    handleVerify,
    clearError,
  } = useMFASetup(open);

  const handleContinue = async () => {
    const success = await handleVerify();
    if (success) {
      onComplete();
      onClose();
    }
  };

  const handleCantScan = () => {
    // TODO: Show alternative setup method (manual entry)
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      if (error) {
        clearError();
      }
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth={false}>
      <StyledHeader>
        <StyledTitle>Scan Code in Authenticator</StyledTitle>
        <StyledCloseButton type="button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M13.4099 12L17.7099 7.71C17.8982 7.5217 18.004 7.2663 18.004 7C18.004 6.7337 17.8982 6.47831 17.7099 6.29C17.5216 6.1017 17.2662 5.99591 16.9999 5.99591C16.7336 5.99591 16.4782 6.1017 16.2899 6.29L11.9999 10.59L7.70994 6.29C7.52164 6.1017 7.26624 5.99591 6.99994 5.99591C6.73364 5.99591 6.47824 6.1017 6.28994 6.29C6.10164 6.47831 5.99585 6.7337 5.99585 7C5.99585 7.2663 6.10164 7.5217 6.28994 7.71L10.5899 12L6.28994 16.29C6.19621 16.383 6.12182 16.4936 6.07105 16.6154C6.02028 16.7373 5.99414 16.868 5.99414 17C5.99414 17.132 6.02028 17.2627 6.07105 17.3846C6.12182 17.5064 6.19621 17.617 6.28994 17.71C6.3829 17.8037 6.4935 17.8781 6.61536 17.9289C6.73722 17.9797 6.86793 18.0058 6.99994 18.0058C7.13195 18.0058 7.26266 17.9797 7.38452 17.9289C7.50638 17.8781 7.61698 17.8037 7.70994 17.71L11.9999 13.41L16.2899 17.71C16.3829 17.8037 16.4935 17.8781 16.6154 17.9289C16.7372 17.9797 16.8679 18.0058 16.9999 18.0058C17.132 18.0058 17.2627 17.9797 17.3845 17.9289C17.5064 17.8781 17.617 17.8037 17.7099 17.71C17.8037 17.617 17.8781 17.5064 17.9288 17.3846C17.9796 17.2627 18.0057 17.132 18.0057 17C18.0057 16.868 17.9796 16.7373 17.9288 16.6154C17.8781 16.4936 17.8037 16.383 17.7099 16.29L13.4099 12Z"
              fill="#484744"
            />
          </svg>
        </StyledCloseButton>
      </StyledHeader>

      <StyledContent>
        <StyledDescription>
          Scan the QR code below and then enter the verification code that appears in your
          authenticator app to complete setup.
        </StyledDescription>

        <StyledQRCodeContainer>
          {provisioningUri && <QRCodeSVG value={provisioningUri} size={260} />}
          {isLoading && (
            <StyledLoadingContainer>
              <CircularProgress />
            </StyledLoadingContainer>
          )}
        </StyledQRCodeContainer>

        <Box sx={{ width: '340px', position: 'relative' }}>
          <StyledInputContainer hasError={!!error}>
            <StyledInput
              type="text"
              inputMode="numeric"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={handleCodeChange}
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
            Continue
          </StyledButton>
          <StyledButton type="button" className="secondary" onClick={handleCantScan}>
            Can't scan QR code?
          </StyledButton>
        </StyledButtonContainer>
      </StyledContent>
    </StyledDialog>
  );
};
