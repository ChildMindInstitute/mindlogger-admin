import { useTranslation } from 'react-i18next';

import { Modal } from 'components/Popups';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';

import { EditAccessPopupProps } from './EditAccessPopup.types';

export const EditAccessPopup = ({ onClose, editAccessPopupVisible }: EditAccessPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={editAccessPopupVisible}
      onClose={onClose}
      onSubmit={onClose}
      title={t('editAccess')}
      buttonText={t('save')}
    >
      <StyledModalWrapper>{t('editAccess')}</StyledModalWrapper>
    </Modal>
  );
};
