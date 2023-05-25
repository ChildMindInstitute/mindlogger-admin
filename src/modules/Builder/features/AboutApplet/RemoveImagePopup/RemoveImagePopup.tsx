import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { RemoveImagePopupProps } from './RemoveImagePopup.types';

export const RemoveImagePopup = ({ open, onClose, onSubmit }: RemoveImagePopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={open}
      title={t('removeImage')}
      buttonText={t('remove')}
      onClose={onClose}
      onSecondBtnSubmit={onClose}
      onSubmit={onSubmit}
    >
      <StyledModalWrapper>{t('removeImageDescription')}</StyledModalWrapper>
    </Modal>
  );
};
