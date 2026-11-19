import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper } from 'shared/styles';

import { SaveBeforeCopyPopupProps } from './SaveBeforeCopyPopup.types';

export const SaveBeforeCopyPopup = ({
  isOpen,
  onClose,
  onSave,
  'data-testid': dataTestid,
}: SaveBeforeCopyPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onSubmit={onSave}
      onSecondBtnSubmit={onClose}
      title={t('saveChanges')}
      buttonText={t('save')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        <StyledBodyLarge>{t('saveBeforeCopyActivity')}</StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
