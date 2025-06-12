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
      title={t('reportConfiguration')}
      buttonText={t('retry')}
      hasSecondBtn
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
      data-testid="builder-activity-flows-settings-report-config-form-error-popup"
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ color: variables.palette.error }}>{t('saveError')}</StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
