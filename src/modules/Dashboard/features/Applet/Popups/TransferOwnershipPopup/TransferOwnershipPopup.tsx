import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { popups, applet } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { useTransferOwnership } from 'shared/hooks/useTransferOwnership';

import { SuccessTransferOwnershipPopup } from '../SuccessTransferOwnershipPopup';

export const TransferOwnershipPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, applet: appletData } = popups.useData();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;
  const {
    transferOwnershipSuccessVisible,
    isSubmitted,
    setIsSubmitted,
    emailTransfered,
    setEmailTransfered,
    handleSubmit,
  } = useTransferOwnership();

  const transferOwnershipPopupClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        applet: currentApplet,
        key: 'transferOwnershipPopupVisible',
        value: false,
      }),
    );
  };

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
