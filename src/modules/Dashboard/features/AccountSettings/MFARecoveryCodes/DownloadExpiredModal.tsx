import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import { StyledModalWrapper } from 'shared/styles';

interface DownloadExpiredModalProps {
  open: boolean;
  onClose: () => void;
}

export const DownloadExpiredModal = ({ open, onClose }: DownloadExpiredModalProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onClose}
      title={t('mfa.recoveryCodes.downloadExpired.title')}
      buttonText={t('mfa.recoveryCodes.downloadExpired.button')}
      hasSecondBtn={false}
      submitBtnColor="primary"
      data-testid="download-expired-modal"
    >
      <StyledModalWrapper>{t('mfa.recoveryCodes.downloadExpired.description')}</StyledModalWrapper>
    </Modal>
  );
};
