import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { applet } from 'shared/state';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { SuccessTransferOwnershipPopup } from 'modules/Dashboard/features/Applet/Popups';
import { TransferOwnershipRef } from 'modules/Dashboard/features/Applet/TransferOwnership/TransferOwnership.types';
import { Mixpanel } from 'shared/utils';

import { StyledTransferOwnershipForm } from './TransferOwnershipSetting.styles';
import { StyledAppletSettingsButton } from '../AppletSettings.styles';

export const TransferOwnershipSetting = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransfered, setEmailTransfered] = useState('');
  const [transferOwnershipPopupVisible, setTransferOwnershipPopupVisible] = useState(false);
  const transferOwnershipRef = useRef<TransferOwnershipRef | null>(null);

  const dataTestid = 'applet-settings-transfer-ownership';

  const handleSuccessPopupClose = () => {
    setTransferOwnershipPopupVisible(false);
    setEmailTransfered('');
    transferOwnershipRef.current?.resetEmail();
  };

  useEffect(() => {
    if (!emailTransfered) return;

    setTransferOwnershipPopupVisible(true);
    Mixpanel.track('Invitation sent successfully');
  }, [emailTransfered]);

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
          onClick={() => setIsSubmitted(true)}
          data-testid={`${dataTestid}-confirm`}
        >
          {t('confirm')}
        </StyledAppletSettingsButton>
      </Box>
      <SuccessTransferOwnershipPopup
        email={emailTransfered}
        transferOwnershipPopupVisible={transferOwnershipPopupVisible}
        closeTransferOwnershipPopup={handleSuccessPopupClose}
        data-testid={`${dataTestid}-success-popup`}
      />
    </>
  );
};
