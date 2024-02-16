import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const handleEmailTransferred = (email: string) => {
    transferOwnershipPopupClose();

    dispatch(
      banners.actions.addBanner({
        key: 'TransferOwnershipSuccessBanner',
        bannerProps: {
          email,
          'data-testid': 'dashboard-applets-transfer-success-banner',
        },
      }),
    );

    Mixpanel.track('Invitation sent successfully');
  };

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
            setEmailTransferred={handleEmailTransferred}
          />
        </StyledModalWrapper>
      </Modal>
    </>
  );
};
