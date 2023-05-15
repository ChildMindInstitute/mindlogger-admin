import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { folders, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { SuccessTransferOwnershipPopup } from '../SuccessTransferOwnershipPopup';

export const TransferOwnershipPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, appletId } = popups.useData();
  const [transferOwnershipSuccessVisible, setTransferOwnershipSuccessVisible] = useState(false);
  const applets = folders.useFlattenFoldersApplets();
  const applet = applets.find((el) => el.id === appletId);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransfered, setEmailTransfered] = useState('');

  const onClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        appletId: '',
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
  }, [emailTransfered]);

  return (
    <>
      <Modal
        open={transferOwnershipPopupVisible && !transferOwnershipSuccessVisible}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={t('transferOwnership')}
        buttonText={t('confirm')}
        width="60"
      >
        <StyledModalWrapper>
          <TransferOwnership
            appletId={applet?.id}
            appletName={applet?.displayName}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            setEmailTransfered={setEmailTransfered}
          />
        </StyledModalWrapper>
      </Modal>
      <SuccessTransferOwnershipPopup
        email={emailTransfered}
        transferOwnershipPopupVisible={transferOwnershipSuccessVisible}
        closeTransferOwnershipPopup={onClose}
      />
    </>
  );
};
