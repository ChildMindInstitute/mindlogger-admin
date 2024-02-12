import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';

import { SaveChangesPopupProps } from './SaveChangesPopup.types';

export const SaveChangesPopup = ({
  isPopupVisible,
  handleClose,
  handleDoNotSaveSubmit,
  handleSaveSubmit,
  'data-testid': dataTestid,
}: SaveChangesPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={isPopupVisible}
      onClose={handleClose}
      onSubmit={handleSaveSubmit}
      onSecondBtnSubmit={handleDoNotSaveSubmit}
      onThirdBtnSubmit={handleClose}
      title={t('saveChanges')}
      buttonText={t('save')}
      secondBtnText={t('dontSave')}
      thirdBtnText={t('cancel')}
      hasSecondBtn
      hasThirdBtn
      secondBtnStyles={{
        color: variables.palette.semantic.error,
        fontWeight: variables.font.weight.bold,
      }}
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ mt: theme.spacing(-1) }}>
          {t('saveChangesDescription')}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
