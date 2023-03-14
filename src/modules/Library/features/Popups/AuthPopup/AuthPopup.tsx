import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { page } from 'resources';
import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { AuthPopupProps } from './AuthPopup.types';

export const AuthPopup = ({ authPopupVisible, setAuthPopupVisible }: AuthPopupProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = () => {
    navigate(page.login, { state: { from: location } });
  };

  return (
    <Modal
      open={authPopupVisible}
      onClose={() => setAuthPopupVisible(false)}
      onSubmit={handleSubmit}
      title={t('youNeedToAuthorize')}
      buttonText={t('yesAuthorize')}
      hasSecondBtn
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={() => setAuthPopupVisible(false)}
    >
      <StyledModalWrapper>{t('youNeedToAuthorizeHint')}</StyledModalWrapper>
    </Modal>
  );
};
