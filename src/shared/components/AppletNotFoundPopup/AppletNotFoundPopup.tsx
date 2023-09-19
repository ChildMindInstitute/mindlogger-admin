import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import { StyledBodyLarge, StyledModalWrapper } from 'shared/styles';

import { useNotFoundPopup } from './AppletNotFoundPopup.hooks';

export const AppletNotFoundPopup = () => {
  const { t } = useTranslation('app');
  const { appletNotFoundPopupVisible, handleClose, handleSubmit } = useNotFoundPopup();

  return (
    <Modal
      open={appletNotFoundPopupVisible}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={t('appletNotFoundPopupTitle')}
      buttonText={t('refresh')}
      data-testid="applet-not-found-popup"
    >
      <StyledModalWrapper>
        <StyledBodyLarge>{t('appletNotFoundPopupText')}</StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
