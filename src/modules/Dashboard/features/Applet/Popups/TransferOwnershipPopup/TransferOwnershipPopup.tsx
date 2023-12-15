import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { popups, applet } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils';

import { SuccessTransferOwnershipPopup } from '../SuccessTransferOwnershipPopup';

export const TransferOwnershipPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, applet: appletData } = popups.useData();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;

  const [transferOwnershipSuccessVisible, setTransferOwnershipSuccessVisible] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransfered, setEmailTransfered] = useState('');

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
    if (!emailTransfered) return;

    setTransferOwnershipSuccessVisible(true);
    Mixpanel.track('Invitation sent successfully');
  }, [emailTransfered]);

  return (
    <>
      <Modal
        open={transferOwnershipPopupVisible && !transferOwnershipSuccessVisible}
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
            setEmailTransfered={setEmailTransfered}
          />
        </StyledModalWrapper>
      </Modal>
      <SuccessTransferOwnershipPopup
        email={emailTransfered}
        transferOwnershipPopupVisible={transferOwnershipSuccessVisible}
        closeTransferOwnershipPopup={transferOwnershipPopupClose}
        data-testid="dashboard-applets-transfer-success-popup"
      />
    </>
  );
};
