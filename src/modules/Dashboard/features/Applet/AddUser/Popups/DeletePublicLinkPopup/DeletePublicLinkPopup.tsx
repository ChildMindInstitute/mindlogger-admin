import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';

import { DeletePublicLinkPopupProps } from './DeletePublicLinkPopup.types';

export const DeletePublicLinkPopup = ({ open, onClose, onSubmit }: DeletePublicLinkPopupProps) => {
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
      data-testid="dashboard-add-users-generate-link-delete-popup"
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ mt: theme.spacing(-1) }}>
          {t('deletePublicLinkDescription')}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
