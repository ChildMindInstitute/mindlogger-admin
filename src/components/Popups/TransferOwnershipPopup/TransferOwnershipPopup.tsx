import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components/Popups';
import { account, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'features/TransferOwnership';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';

export const TransferOwnershipPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, appletId } = popups.useData();
  const accountData = account.useData();
  const applet = accountData?.account?.applets?.find((el) => el.id === appletId);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appletTransfered, setAppletTransfered] = useState(false);

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
    appletTransfered && onClose();
  }, [appletTransfered]);

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
          applet={applet}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          setAppletTransfered={setAppletTransfered}
        />
      </StyledModalWrapper>
    </Modal>
  );
};
