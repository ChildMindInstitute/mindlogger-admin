import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { getLayer } from 'shared/hooks';
import { builderSessionStorage } from 'shared/utils';

import { SaveChangesPopupProps } from './SaveChangesPopup.types';

export const SaveChangesPopup = ({
  isPopupVisible,
  handleClose,
  handleSubmit,
}: SaveChangesPopupProps) => {
  const { t } = useTranslation('app');
  const { pathname } = useLocation();
  const layer = getLayer(pathname);

  const onDoNotSaveClick = () => {
    layer && builderSessionStorage.setItem(layer, {});
    handleSubmit();
  };

  return (
    <Modal
      open={isPopupVisible}
      onClose={handleClose}
      onSubmit={handleSubmit}
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
