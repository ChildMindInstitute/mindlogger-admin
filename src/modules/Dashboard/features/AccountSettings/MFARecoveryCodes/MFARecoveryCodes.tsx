import { mfaApi } from 'shared/api';
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

export const MFARecoveryCodes = ({
  open,
  onClose,
  recoveryCodes,
  onConfirm,
  downloadToken,
}: MFARecoveryCodesProps) => {
  // Helper function to check if recovery codes have usage status
  const isRecoveryCodeItem = (code: string | RecoveryCodeItem): code is RecoveryCodeItem =>
    typeof code === 'object' && 'used' in code;

  // Helper function to get code string
  const getCodeString = (code: string | RecoveryCodeItem): string =>
    isRecoveryCodeItem(code) ? code.code : code;

  // Helper function to check if code is used
  const isCodeUsed = (code: string | RecoveryCodeItem): boolean =>
    isRecoveryCodeItem(code) ? code.used : false;

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

  const handleDownload = async () => {
    // If downloadToken is available (viewing scenario), use backend endpoint
    if (downloadToken) {
      try {
        const response = await mfaApi.downloadRecoveryCodes(downloadToken);
        
        // Create blob from response data
        const blob = new Blob([response.data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Extract filename from Content-Disposition header or use default
        const contentDisposition = response.headers['content-disposition'];
        const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
        const filename = filenameMatch ? filenameMatch[1] : 'recovery_codes.txt';
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download recovery codes:', error);
        // Fallback to frontend download if backend fails
        downloadFromFrontend();
      }
    } else {
      // No token (setup scenario), create file on frontend
      downloadFromFrontend();
    }
  };

  const downloadFromFrontend = () => {
    // Convert codes to strings (handles both string[] and RecoveryCodeItem[])
    const codeStrings = recoveryCodes.map((code) => getCodeString(code));
    const codesText = codeStrings.join('\n');
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
