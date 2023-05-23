import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { SuccessPopupProps } from './SuccessPopup.types';

export const SuccessPopup = ({ popupVisible, setPopupVisible }: SuccessPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={popupVisible}
      onClose={() => setPopupVisible(false)}
      onSubmit={() => setPopupVisible(false)}
      title={t('dataRetentionUpdate')}
      buttonText={t('ok')}
    >
      <StyledModalWrapper>{t('dataRetentionUpdatedSuccess')}</StyledModalWrapper>
    </Modal>
  );
};
