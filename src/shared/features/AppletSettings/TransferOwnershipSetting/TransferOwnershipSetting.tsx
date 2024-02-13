import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { applet } from 'shared/state';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { SuccessTransferOwnershipPopup } from 'modules/Dashboard/features/Applet/Popups';
import { TransferOwnershipRef } from 'modules/Dashboard/features/Applet/TransferOwnership/TransferOwnership.types';
import { useTransferOwnership } from 'shared/hooks/useTransferOwnership';

import { StyledTransferOwnershipForm } from './TransferOwnershipSetting.styles';
import { StyledAppletSettingsButton } from '../AppletSettings.styles';

export const TransferOwnershipSetting = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};
  const {
    transferOwnershipSuccessVisible,
    setTransferOwnershipSuccessVisible,
    isSubmitted,
    setIsSubmitted,
    emailTransfered,
    setEmailTransfered,
    handleSubmit,
  } = useTransferOwnership();
  const transferOwnershipRef = useRef<TransferOwnershipRef | null>(null);

  const dataTestid = 'applet-settings-transfer-ownership';

  const handleSuccessPopupClose = () => {
    setTransferOwnershipSuccessVisible(false);
    setEmailTransfered('');
    transferOwnershipRef.current?.resetEmail();
  };

  return (
    <>
      <StyledTransferOwnershipForm>
        <TransferOwnership
          ref={transferOwnershipRef}
          appletId={appletData?.id}
          appletName={appletData?.displayName}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          setEmailTransfered={setEmailTransfered}
          data-testid={`${dataTestid}-form`}
        />
      </StyledTransferOwnershipForm>
      <Box sx={{ width: 'fit-content' }}>
        <StyledAppletSettingsButton
          variant="outlined"
          onClick={handleSubmit}
          data-testid={`${dataTestid}-confirm`}
        >
          {t('confirm')}
        </StyledAppletSettingsButton>
      </Box>
      <SuccessTransferOwnershipPopup
        email={emailTransfered}
        transferOwnershipPopupVisible={transferOwnershipSuccessVisible}
        closeTransferOwnershipPopup={handleSuccessPopupClose}
        data-testid={`${dataTestid}-success-popup`}
      />
    </>
  );
};
