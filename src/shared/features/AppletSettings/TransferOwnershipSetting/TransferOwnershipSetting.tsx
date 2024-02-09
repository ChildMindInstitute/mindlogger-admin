import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
  const [emailTransferred, setEmailTransferred] = useState('');
  const transferOwnershipRef = useRef<TransferOwnershipRef | null>(null);

  const dataTestid = 'applet-settings-transfer-ownership';

  const handleSuccess = () => {
    setEmailTransferred('');
    transferOwnershipRef.current?.resetEmail();
  };

  useEffect(() => {
    if (!emailTransferred) return;

    dispatch(
      banners.actions.addBanner({
        key: 'SaveSuccessBanner',
        bannerProps: {
          children: (
            <Trans i18nKey="requestTransferOwnershipSuccess">
              <>
                Your request has been successfully sent to
                <strong>
                  <>{{ email: emailTransferred }}</>
                </strong>
                . Please wait for receiver to accept your request.
              </>
            </Trans>
          ),
          duration: 7000,
          'data-testid': `${dataTestid}-success-popup`,
        },
      }),
    );

    handleSuccess();

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
