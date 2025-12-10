import {
  StyledDialog,
  StyledHeader,
  StyledTitle,
  StyledCloseButton,
  StyledContent,
  StyledDescription,
  StyledCodesContainer,
  StyledCodesList,
  StyledButtonContainer,
  StyledButton,
} from './MFARecoveryCodes.styles';
import { MFARecoveryCodesProps } from './MFARecoveryCodes.types';
import { CloseIcon } from '../shared/CloseIcon';

export const MFARecoveryCodes = ({
  open,
  onClose,
  recoveryCodes,
  onConfirm,
}: MFARecoveryCodesProps) => {
  const handleClose = () => {
    // Remove focus from any focused element before closing to prevent aria-hidden focus warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  const handleDownload = () => {
    const codesText = recoveryCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mfa-recovery-codes.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth={false} disableRestoreFocus>
      <StyledHeader>
        <StyledTitle>Save Your Recovery Codes</StyledTitle>
        <StyledCloseButton type="button" onClick={handleClose}>
          <CloseIcon />
        </StyledCloseButton>
      </StyledHeader>

      <StyledContent>
        <StyledDescription>
          <p>
            Recovery codes can be used to access your account in the event you lose access to the
            device you're using for 2FA.
          </p>
          <p>
            You'll need to re-authenticate to view these codes again, so please make sure to save
            them now.
          </p>
        </StyledDescription>

        <StyledCodesContainer>
          <StyledCodesList>
            {recoveryCodes.map((code, index) => (
              <p key={index}>{code}</p>
            ))}
          </StyledCodesList>
        </StyledCodesContainer>

        <StyledButtonContainer>
          <StyledButton type="button" onClick={handleConfirm}>
            I've saved my codes
          </StyledButton>
          <StyledButton type="button" className="secondary" onClick={handleDownload}>
            Download as text file
          </StyledButton>
        </StyledButtonContainer>
      </StyledContent>
    </StyledDialog>
  );
};
