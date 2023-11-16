import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { SuccessPopupProps } from './SuccessPopup.types';

export const SuccessPopup = ({
  popupVisible,
  onClose,
  'data-testid': dataTestid,
}: SuccessPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={popupVisible}
      onClose={onClose}
      onSubmit={onClose}
      title={t('dataRetentionUpdate')}
      buttonText={t('ok')}
      data-testid={dataTestid}
    >
      <StyledModalWrapper>{t('dataRetentionUpdatedSuccess')}</StyledModalWrapper>
    </Modal>
  );
};
