import {
  StyledDialog,
  StyledHeader,
  StyledTitle,
  StyledCloseButton,
  StyledContent,
  StyledDescription,
  StyledDescriptionMultiLine,
} from './MFAManualSetup.styles';
import { MFAManualSetupProps } from './MFAManualSetup.types';
import { CloseIcon } from '../shared/CloseIcon';
import { SecretKeyDisplay } from './SecretKeyDisplay';
import { VerificationForm } from './VerificationForm';
import { useMFAInputHandler } from '../shared/useMFAInputHandler';

export const MFAManualSetup = ({
  open,
  onClose,
  onComplete,
  onBack,
  secretKey,
  verificationCode,
  isLoading,
  error,
  setVerificationCode,
  handleVerify,
  clearError,
}: MFAManualSetupProps) => {
  const { handleInputChange } = useMFAInputHandler(setVerificationCode, clearError, error);

  const handleContinue = async () => {
    const success = await handleVerify();
    if (success) {
      // Call onComplete BEFORE onClose to ensure state updates first
      onComplete();
      // Small delay to ensure state propagates
      await new Promise((resolve) => setTimeout(resolve, 100));
      onClose();
    }
  };

  const handleClose = () => {
    // Remove focus from any focused element before closing to prevent aria-hidden focus warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth={false} disableRestoreFocus>
      <StyledHeader>
        <StyledTitle>Type Key in Authenticator</StyledTitle>
        <StyledCloseButton type="button" onClick={handleClose}>
          <CloseIcon />
        </StyledCloseButton>
      </StyledHeader>

      <StyledContent>
        <StyledDescription>Enter the setup key below in your authenticator app.</StyledDescription>

        <SecretKeyDisplay secretKey={secretKey} />

        <StyledDescriptionMultiLine>
          Then, enter the verification code that appears in your authenticator app to complete
          setup.
        </StyledDescriptionMultiLine>

        <VerificationForm
          verificationCode={verificationCode}
          isLoading={isLoading}
          error={error}
          onInputChange={handleInputChange}
          onContinue={handleContinue}
          onBack={onBack}
        />
      </StyledContent>
    </StyledDialog>
  );
};
