import { useTranslation } from 'react-i18next';

import { Modal, ModalProps } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

export const RemovePhrasePopup = ({
  onRemove,
  ...otherProps
}: Omit<ModalProps, 'title' | 'children'> & { onRemove?: () => void }) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      buttonText={t('phrasalTemplateRemovePopup.confirm')}
      onSubmit={onRemove}
      submitBtnColor="error"
      title={t('phrasalTemplateRemovePopup.title')}
      {...otherProps}
    >
      <StyledModalWrapper>{t('phrasalTemplateRemovePopup.areYouSure')}</StyledModalWrapper>
    </Modal>
  );
};
