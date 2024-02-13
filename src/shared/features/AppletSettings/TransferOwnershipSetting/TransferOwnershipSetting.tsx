import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { applet } from 'shared/state';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { SuccessTransferOwnershipPopup } from 'modules/Dashboard/features/Applet/Popups';
import { TransferOwnershipRef } from 'modules/Dashboard/features/Applet/TransferOwnership/TransferOwnership.types';
import { Mixpanel } from 'shared/utils';
import { NoPermissionPopup } from 'shared/components';

import { StyledTransferOwnershipForm } from './TransferOwnershipSetting.styles';
import { StyledAppletSettingsButton } from '../AppletSettings.styles';

export const TransferOwnershipSetting = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransferred, setEmailTransferred] = useState('');
  const [transferOwnershipPopupVisible, setTransferOwnershipPopupVisible] = useState(false);
  const transferOwnershipRef = useRef<TransferOwnershipRef | null>(null);
  const [noPermissionPopupVisible, setNoPermissionPopupVisible] = useState(false);

  const dataTestid = 'applet-settings-transfer-ownership';

  const handlePopupClose = () => {
    setTransferOwnershipPopupVisible(false);
    setEmailTransferred('');
    transferOwnershipRef.current?.resetEmail();
  };

  useEffect(() => {
    if (!emailTransferred) return;

    setTransferOwnershipPopupVisible(true);
    Mixpanel.track('Invitation sent successfully');
  }, [emailTransferred]);

  return (
    <>
      <StyledTransferOwnershipForm>
        <TransferOwnership
          ref={transferOwnershipRef}
          appletId={appletData?.id}
          appletName={appletData?.displayName}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          setEmailTransferred={setEmailTransferred}
          setNoPermissionPopupVisible={setNoPermissionPopupVisible}
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
      {transferOwnershipPopupVisible && (
        <SuccessTransferOwnershipPopup
          email={emailTransferred}
          transferOwnershipPopupVisible={transferOwnershipPopupVisible}
          closeTransferOwnershipPopup={handlePopupClose}
          data-testid={`${dataTestid}-success-popup`}
        />
      )}
      {noPermissionPopupVisible && (
        <NoPermissionPopup
          open={noPermissionPopupVisible}
          title={t('transferOwnership')}
          onSubmitCallback={handlePopupClose}
          data-testid={`${dataTestid}-no-permission-popup`}
        />
      )}
    </>
  );
};
