import { useTranslation } from 'react-i18next';

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
  onRecoveryCodes,
}: MFAManualSetupProps) => {
  const { t } = useTranslation('app');
  const { handleInputChange } = useMFAInputHandler(setVerificationCode, clearError, error);

  const handleContinue = async () => {
    const result = await handleVerify();
    if (result.success) {
      if (result.recoveryCodes && result.recoveryCodes.length > 0 && onRecoveryCodes) {
        // Notify parent about recovery codes
        onRecoveryCodes(result.recoveryCodes);
      } else {
        // No recovery codes, complete setup
        onComplete();
        // Small delay to ensure state propagates
        await new Promise((resolve) => setTimeout(resolve, 100));
        onClose();
      }
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
        <StyledTitle>{t('mfa.setup.manualTitle')}</StyledTitle>
        <StyledCloseButton type="button" onClick={handleClose}>
          <CloseIcon />
        </StyledCloseButton>
      </StyledHeader>

      <StyledContent>
        <StyledDescription>{t('mfa.setup.manualDescription')}</StyledDescription>

        <SecretKeyDisplay secretKey={secretKey} />

        <StyledDescriptionMultiLine>{t('mfa.setup.manualInstructions')}</StyledDescriptionMultiLine>

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
