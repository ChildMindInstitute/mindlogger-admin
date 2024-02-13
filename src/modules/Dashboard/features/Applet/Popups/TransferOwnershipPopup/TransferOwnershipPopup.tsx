import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, NoPermissionPopup } from 'shared/components';
import { popups, applet } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils';

import { SuccessTransferOwnershipPopup } from '../SuccessTransferOwnershipPopup';
import { TransferOwnershipPopupProps } from './TransferOwnershipPopup.types';

export const TransferOwnershipPopup = ({ onClosCallback }: TransferOwnershipPopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, applet: appletData } = popups.useData();
  const { result } = applet.useAppletData() || {};
  const currentApplet = appletData || result;

  const [transferOwnershipSuccessVisible, setTransferOwnershipSuccessVisible] = useState(false);
  const [noPermissionPopupVisible, setNoPermissionPopupVisible] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransferred, setEmailTransferred] = useState('');

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

  const noPermissionPopupCallback = () => {
    transferOwnershipPopupClose();
    onClosCallback?.();
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (!emailTransferred) return;

    setTransferOwnershipSuccessVisible(true);
    Mixpanel.track('Invitation sent successfully');
  }, [emailTransferred]);

  return (
    <>
      <Modal
        open={transferOwnershipPopupVisible && !transferOwnershipSuccessVisible}
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
            setEmailTransferred={setEmailTransferred}
            setNoPermissionPopupVisible={setNoPermissionPopupVisible}
          />
        </StyledModalWrapper>
      </Modal>
      {transferOwnershipSuccessVisible && (
        <SuccessTransferOwnershipPopup
          email={emailTransferred}
          transferOwnershipPopupVisible={transferOwnershipSuccessVisible}
          closeTransferOwnershipPopup={transferOwnershipPopupClose}
          data-testid={`${dataTestid}-success-popup`}
        />
      )}
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
