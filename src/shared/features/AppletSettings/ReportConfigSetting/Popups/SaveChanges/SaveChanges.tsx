import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper } from 'shared/styles';

import { SaveChangesPopupProps } from './SaveChanges.types';

export const SaveChanges = ({ popupVisible, onClose, saveCallback }: SaveChangesPopupProps) => {
  const { t } = useTranslation('app');

  const onSave = () => {
    saveCallback();
  };

  return (
    <Modal
      open={popupVisible}
      onClose={onClose}
      onSubmit={onSave}
      title={t('saveChanges')}
      buttonText={t('save')}
      hasSecondBtn
      secondBtnText={t('dontSave')}
      onSecondBtnSubmit={onClose}
    >
      <StyledModalWrapper>
        <StyledBodyLarge>{t('saveChangesDescription')}</StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
