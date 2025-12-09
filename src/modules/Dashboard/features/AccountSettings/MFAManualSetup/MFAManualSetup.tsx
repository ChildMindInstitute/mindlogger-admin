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

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth={false}>
      <StyledHeader>
        <StyledTitle>Type Key in Authenticator</StyledTitle>
        <StyledCloseButton type="button" onClick={onClose}>
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
