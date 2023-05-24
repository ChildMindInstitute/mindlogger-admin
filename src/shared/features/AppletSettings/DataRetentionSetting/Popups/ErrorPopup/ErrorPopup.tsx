import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, variables } from 'shared/styles';

import { ErrorPopupProps } from './ErrorPopup.types';

export const ErrorPopup = ({ popupVisible, setPopupVisible, retryCallback }: ErrorPopupProps) => {
  const { t } = useTranslation('app');

  const onClose = () => setPopupVisible(false);

  const onRetry = () => {
    onClose();
    retryCallback();
  };

  return (
    <Modal
      open={popupVisible}
      onClose={onClose}
      onSubmit={onRetry}
      title={t('dataRetentionUpdate')}
      buttonText={t('retry')}
      hasSecondBtn
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
          {t('dataRetentionUpdatedFail')}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
