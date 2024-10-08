import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { popups, applet } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { useTransferOwnership } from 'shared/hooks/useTransferOwnership';

export const TransferOwnershipPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, applet: appletData } = popups.useData();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;
  const { isSubmitted, setIsSubmitted, handleSubmit, handleSendInvitation } = useTransferOwnership(
    currentApplet?.id,
  );

  const transferOwnershipPopupClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        applet: currentApplet,
        key: 'transferOwnershipPopupVisible',
        value: false,
      }),
    );
  };

  const handleEmailTransferred = handleSendInvitation(transferOwnershipPopupClose);

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
            encryption={currentApplet?.encryption}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            setEmailTransferred={handleEmailTransferred}
          />
        </StyledModalWrapper>
      </Modal>
    </>
  );
};
