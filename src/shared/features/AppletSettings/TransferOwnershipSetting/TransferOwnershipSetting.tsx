import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { applet, banners } from 'shared/state';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { TransferOwnershipRef } from 'modules/Dashboard/features/Applet/TransferOwnership/TransferOwnership.types';
import { Mixpanel } from 'shared/utils';
import { useAppDispatch } from 'redux/store';

import { StyledTransferOwnershipForm } from './TransferOwnershipSetting.styles';
import { StyledAppletSettingsButton } from '../AppletSettings.styles';

export const TransferOwnershipSetting = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};

  const [isSubmitted, setIsSubmitted] = useState(false);
  const transferOwnershipRef = useRef<TransferOwnershipRef | null>(null);

  const dataTestid = 'applet-settings-transfer-ownership';

  const handleEmailTransferred = (email: string) => {
    dispatch(
      banners.actions.addBanner({
        key: 'TransferOwnershipSuccessBanner',
        bannerProps: {
          email,
          'data-testid': `${dataTestid}-success-banner`,
        },
      }),
    );

    transferOwnershipRef.current?.resetEmail();

    Mixpanel.track('Invitation sent successfully');
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
          setEmailTransferred={handleEmailTransferred}
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
    </>
  );
};
