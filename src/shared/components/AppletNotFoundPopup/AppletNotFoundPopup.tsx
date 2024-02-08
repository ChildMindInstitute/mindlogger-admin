import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Modal } from 'shared/components/Modal';
import { StyledBodyLarge, StyledModalWrapper } from 'shared/styles';
import { checkIfAppletUrlPassed, falseReturnFunc } from 'shared/utils';

import { useNotFoundPopup } from './AppletNotFoundPopup.hooks';

export const AppletNotFoundPopup = () => {
  const { t } = useTranslation('app');
  const { appletNotFoundPopupVisible, handleClose, handleSubmit } = useNotFoundPopup();
  const { pathname } = useLocation();

  const isBuilder = checkIfAppletUrlPassed(pathname);

  if (!appletNotFoundPopupVisible) return null;

  return (
    <Modal
      open={appletNotFoundPopupVisible}
      onClose={isBuilder ? falseReturnFunc : handleClose}
      onSubmit={handleSubmit}
      title={t('appletNotFoundPopupTitle')}
      buttonText={isBuilder ? t('goToDashboard') : t('refresh')}
      hasCloseIcon={!isBuilder}
      data-testid="applet-not-found-popup">
      {isBuilder ? null : (
        <StyledModalWrapper>
          <StyledBodyLarge>{t('appletNotFoundPopupText')}</StyledBodyLarge>
        </StyledModalWrapper>
      )}
    </Modal>
  );
};
