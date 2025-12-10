import { useState } from 'react';
import { CircularProgress } from '@mui/material';
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
import { MFAManualSetup } from '../MFAManualSetup/MFAManualSetup';
import { MFARecoveryCodes } from '../MFARecoveryCodes/MFARecoveryCodes';
import { CloseIcon } from '../shared/CloseIcon';
import { MFAVerificationForm } from '../shared/MFAVerificationForm';
import { useMFAInputHandler } from '../shared/useMFAInputHandler';

export const MFASetup = ({ open, onClose, onComplete }: MFASetupProps) => {
  const [showManualSetup, setShowManualSetup] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const {
    provisioningUri,
    verificationCode,
    isLoading,
    error,
    setVerificationCode,
    handleVerify,
    clearError,
    secretKey,
  } = useMFASetup(open);

  const { handleInputChange } = useMFAInputHandler(setVerificationCode, clearError, error);

  const handleContinue = async () => {
    const result = await handleVerify();
    if (result.success) {
      if (result.recoveryCodes && result.recoveryCodes.length > 0) {
        // Show recovery codes modal
        setRecoveryCodes(result.recoveryCodes);
      } else {
        // No recovery codes, complete setup
        onComplete();
        // Small delay to ensure state propagates
        await new Promise((resolve) => setTimeout(resolve, 100));
        onClose();
      }
    }
  };

  const handleRecoveryCodesConfirm = () => {
    setRecoveryCodes(null);
    onComplete();
    onClose();
  };

  const handleCantScan = () => {
    setShowManualSetup(true);
  };

  const handleBackToQR = () => {
    setShowManualSetup(false);
  };

  const handleClose = () => {
    // Remove focus from any focused element before closing to prevent aria-hidden focus warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  // Show recovery codes modal if codes are available
  if (recoveryCodes && recoveryCodes.length > 0) {
    return (
      <MFARecoveryCodes
        open={open}
        onClose={onClose}
        recoveryCodes={recoveryCodes}
        onConfirm={handleRecoveryCodesConfirm}
      />
    );
  }

  // Show manual setup view if requested
  if (showManualSetup) {
    return (
      <MFAManualSetup
        open={open}
        onClose={onClose}
        onComplete={onComplete}
        onBack={handleBackToQR}
        secretKey={secretKey}
        verificationCode={verificationCode}
        isLoading={isLoading}
        error={error}
        setVerificationCode={setVerificationCode}
        handleVerify={handleVerify}
        clearError={clearError}
        onRecoveryCodes={setRecoveryCodes}
      />
    );
  }

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth={false} disableRestoreFocus>
      <StyledHeader>
        <StyledTitle>Scan Code in Authenticator</StyledTitle>
        <StyledCloseButton type="button" onClick={handleClose}>
          <CloseIcon />
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

        <MFAVerificationForm
          verificationCode={verificationCode}
          isLoading={isLoading}
          error={error}
          onInputChange={handleInputChange}
          onPrimaryAction={handleContinue}
          onSecondaryAction={handleCantScan}
          primaryButtonText="Continue"
          secondaryButtonText="Can't scan QR code?"
          inputWidth="340px"
          StyledInputContainer={StyledInputContainer}
          StyledInput={StyledInput}
          StyledButtonContainer={StyledButtonContainer}
          StyledButton={StyledButton}
          StyledErrorMessage={StyledErrorMessage}
        />
      </StyledContent>
    </StyledDialog>
  );
};
