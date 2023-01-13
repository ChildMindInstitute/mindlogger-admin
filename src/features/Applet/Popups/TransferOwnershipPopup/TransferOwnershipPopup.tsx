import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components';
import { account, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'features/Applet/TransferOwnership';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';

export const TransferOwnershipPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, appletId } = popups.useData();
  const accountData = account.useData();
  const applet = accountData?.account?.applets?.find((el) => el.id === appletId);

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

  useEffect(() => {
    emailTransfered && onClose();
  }, [emailTransfered]);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <Modal
      open={transferOwnershipPopupVisible}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={t('transferOwnership')}
      buttonText={t('confirm')}
    >
      <StyledModalWrapper>
        <TransferOwnership
          applet={applet!}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          setEmailTransfered={setEmailTransfered}
        />
      </StyledModalWrapper>
    </Modal>
  );
};
