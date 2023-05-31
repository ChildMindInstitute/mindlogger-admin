import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';

import { DeletePopupProps } from './DeletePopup.types';

export const DeletePopup = ({ open, onClose, onSubmit }: DeletePopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onSecondBtnSubmit={onClose}
      title={t('deletePublicLink')}
      buttonText={t('delete')}
      secondBtnText={t('cancel')}
      submitBtnColor="error"
      hasSecondBtn
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ mt: theme.spacing(-1) }}>
          {t('deletePublicLinkDescription')}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
