import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { SuccessTransferOwnershipPopupProps } from './SuccessTransferOwnershipPopup.types';

export const SuccessTransferOwnershipPopup = ({
  email,
  transferOwnershipPopupVisible,
  setTransferOwnershipPopupVisible,
}: SuccessTransferOwnershipPopupProps) => {
  const { t } = useTranslation();

  const closeTransferOwnershipPopup = () => setTransferOwnershipPopupVisible(false);

  return (
    <Modal
      open={transferOwnershipPopupVisible}
      onClose={closeTransferOwnershipPopup}
      onSubmit={closeTransferOwnershipPopup}
      title={t('transferOwnership')}
      buttonText={t('ok')}
      width="60"
    >
      <StyledModalWrapper>{t('requestTransferOwnershipSuccess', { email })}</StyledModalWrapper>
    </Modal>
  );
};
