import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, NoPermissionPopup } from 'shared/components';
import { popups, applet } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { useTransferOwnership } from 'shared/hooks/useTransferOwnership';

import { TransferOwnershipPopupProps } from './TransferOwnershipPopup.types';

export const TransferOwnershipPopup = ({ onCloseCallback }: TransferOwnershipPopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, applet: appletData } = popups.useData();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;
  const [noPermissionPopupVisible, setNoPermissionPopupVisible] = useState(false);
  const { isSubmitted, setIsSubmitted, handleSubmit, handleSendInvitation } =
    useTransferOwnership();

  const dataTestid = 'dashboard-applets-transfer';

  const transferOwnershipPopupClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        applet: currentApplet,
        key: 'transferOwnershipPopupVisible',
        value: false,
      }),
    );
  };

  const handleEmailTransferred = handleSendInvitation({
    callback: transferOwnershipPopupClose,
    bannerTestId: 'dashboard-applets-transfer-success-banner',
  });

  const noPermissionPopupCallback = () => {
    transferOwnershipPopupClose();
    onCloseCallback?.();
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
        data-testid={`${dataTestid}-popup`}
      >
        <StyledModalWrapper>
          <TransferOwnership
            appletId={currentApplet?.id ?? ''}
            appletName={currentApplet?.displayName}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            setEmailTransferred={handleEmailTransferred}
            setNoPermissionPopupVisible={setNoPermissionPopupVisible}
          />
        </StyledModalWrapper>
      </Modal>
      {noPermissionPopupVisible && (
        <NoPermissionPopup
          open={noPermissionPopupVisible}
          title={t('transferOwnership')}
          onSubmitCallback={noPermissionPopupCallback}
          data-testid={`${dataTestid}-no-permission-popup`}
        />
      )}
    </>
  );
};
