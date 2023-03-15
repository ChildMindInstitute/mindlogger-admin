import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { applets, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

export const TransferOwnershipPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { transferOwnershipPopupVisible, appletId } = popups.useData();
  const appletstData = applets.useData();
  const applet = appletstData?.result?.find((el) => el.id === appletId);

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
      width="60"
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
