import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { applet } from 'shared/state';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { TransferOwnershipRef } from 'modules/Dashboard/features/Applet/TransferOwnership/TransferOwnership.types';
import { useTransferOwnership } from 'shared/hooks/useTransferOwnership';

import { StyledTransferOwnershipForm } from './TransferOwnershipSetting.styles';
import { StyledAppletSettingsButton } from '../AppletSettings.styles';

export const TransferOwnershipSetting = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};
  const { isSubmitted, setIsSubmitted, handleSubmit, handleSendInvitation } = useTransferOwnership(
    appletData?.id,
  );
  const transferOwnershipRef = useRef<TransferOwnershipRef | null>(null);

  const dataTestid = 'applet-settings-transfer-ownership';

  const handleEmailTransferred = handleSendInvitation(transferOwnershipRef.current?.resetEmail);

  return (
    <>
      <StyledTransferOwnershipForm>
        <TransferOwnership
          ref={transferOwnershipRef}
          appletId={appletData?.id}
          appletName={appletData?.displayName}
          encryption={appletData?.encryption}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          setEmailTransferred={handleEmailTransferred}
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
    </>
  );
};
