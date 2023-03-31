import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';

import { SaveChangesPopupProps } from './SaveChangesPopup.types';
import { useSaveChangesPopupSetup } from './SaveChangesPopup.hooks';

export const SaveChangesPopup = ({
  isPopupVisible,
  handleClose,
  handleSubmit,
}: SaveChangesPopupProps) => {
  const { t } = useTranslation('app');
  const { onDoNotSaveClick, onSaveClick } = useSaveChangesPopupSetup(handleSubmit);

  return (
    <Modal
      open={isPopupVisible}
      onClose={handleClose}
      onSubmit={onSaveClick}
      onSecondBtnSubmit={onDoNotSaveClick}
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
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ mt: theme.spacing(-1) }}>
          {t('saveChangesDescription')}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
