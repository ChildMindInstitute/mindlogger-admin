import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RecoveryCodeItem } from 'shared/api/api.mfa.types';
import { Svg } from 'shared/components/Svg';
import { checkIfShouldLogging } from 'shared/utils/logger';

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
import { getCodeString, isCodeUsed } from './MFARecoveryCodes.utils';
import { useRecoveryCodesDownload } from './useRecoveryCodesDownload';
import { DownloadExpiredModal } from './DownloadExpiredModal';
import { DownloadNetworkErrorModal } from './DownloadNetworkErrorModal';

export const MFARecoveryCodes = ({
  open,
  onClose,
  recoveryCodes,
  onConfirm,
  downloadToken,
}: MFARecoveryCodesProps) => {
  const { t } = useTranslation('app');
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showNetworkErrorModal, setShowNetworkErrorModal] = useState(false);
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

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await handleDownload();
    } catch (error) {
      if (checkIfShouldLogging()) {
        console.error('Error downloading recovery codes:', error);
      }
      // Differentiate between network errors and session expiry:
      // - Network errors (offline): error has no response property
      // - Session/token expiry: error has response with 401/403 status
      const hasResponse = error && typeof error === 'object' && 'response' in error;

      if (hasResponse) {
        // HTTP error (session expired, invalid token, etc.)
        setShowExpiredModal(true);
      } else {
        // Network error (offline, connection failed)
        setShowNetworkErrorModal(true);
      }
    }
  };

  const handleExpiredModalClose = () => {
    setShowExpiredModal(false);
    // Close the recovery codes modal too
    handleClose();
  };

  const handleNetworkErrorModalClose = () => {
    setShowNetworkErrorModal(false);
    // Don't close the recovery codes modal - user can retry
  };

  return (
    <>
      <StyledDialog open={open} onClose={handleClose} maxWidth={false} disableRestoreFocus>
        <StyledHeader>
          <StyledTitle>{t('mfa.recoveryCodes.saveTitle')}</StyledTitle>
          <StyledCloseButton type="button" onClick={handleClose}>
            <Svg id="close" width={24} height={24} />
          </StyledCloseButton>
        </StyledHeader>

        <StyledContent>
          <StyledDescription>
            <p>{t('mfa.recoveryCodes.saveDescription1')}</p>
            <p>{t('mfa.recoveryCodes.saveDescription2')}</p>
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
              {t('mfa.buttons.savedCodes')}
            </StyledButton>
            <StyledButton type="button" className="secondary" onClick={handleDownloadClick}>
              {t('mfa.buttons.downloadCodes')}
            </StyledButton>
          </StyledButtonContainer>
        </StyledContent>
      </StyledDialog>

      <DownloadExpiredModal open={showExpiredModal} onClose={handleExpiredModalClose} />
      <DownloadNetworkErrorModal
        open={showNetworkErrorModal}
        onClose={handleNetworkErrorModalClose}
      />
    </>
  );
};
