import { RecoveryCodeItem } from 'shared/api/api.mfa.types';

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
import { getCodeString, isCodeUsed } from './MFARecoveryCodes.utils';
import { useRecoveryCodesDownload } from './useRecoveryCodesDownload';

export const MFARecoveryCodes = ({
  open,
  onClose,
  recoveryCodes,
  onConfirm,
  downloadToken,
}: MFARecoveryCodesProps) => {
  // Use custom hook for download functionality
  const { handleDownload } = useRecoveryCodesDownload(recoveryCodes, downloadToken);

  // Helper function to render code with strikethrough for used codes
  const renderCode = (code: string | RecoveryCodeItem) => {
    const codeString = getCodeString(code);
    const isUsed = isCodeUsed(code);

    if (isUsed) {
      return (
        <span style={{ textDecoration: 'line-through', textDecorationThickness: '2px' }}>
          {codeString}
        </span>
      );
    }

    return codeString;
  };

  const handleClose = () => {
    // Remove focus from any focused element before closing to prevent aria-hidden focus warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // Always trigger completion when modal closes (MFA is already enabled at this point)
    onConfirm();
    onClose();
  };

  const handleConfirm = () => {
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
              <p key={index}>{renderCode(code)}</p>
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
