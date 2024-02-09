import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { popups, applet, banners } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils';

export const TransferOwnershipPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, applet: appletData } = popups.useData();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransferred, setEmailTransferred] = useState('');

  const transferOwnershipPopupClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        applet: currentApplet,
        key: 'transferOwnershipPopupVisible',
        value: false,
      }),
    );
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (!emailTransferred) return;

    transferOwnershipPopupClose();

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
          'data-testid': 'dashboard-applets-transfer-success-banner',
        },
      }),
    );

    Mixpanel.track('Invitation sent successfully');
  }, [emailTransferred, emailTransferred]);

  return (
    <>
      <Modal
        open={transferOwnershipPopupVisible}
        onClose={transferOwnershipPopupClose}
        onSubmit={handleSubmit}
        title={t('transferOwnership')}
        buttonText={t('confirm')}
        width="60"
        data-testid="dashboard-applets-transfer-popup"
      >
        <StyledModalWrapper>
          <TransferOwnership
            appletId={currentApplet?.id ?? ''}
            appletName={currentApplet?.displayName}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            setEmailTransferred={setEmailTransferred}
          />
        </StyledModalWrapper>
      </Modal>
    </>
  );
};
