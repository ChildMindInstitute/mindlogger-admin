import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import { StyledModalWrapper } from 'shared/styles';

interface DownloadNetworkErrorModalProps {
  open: boolean;
  onClose: () => void;
}

export const DownloadNetworkErrorModal = ({ open, onClose }: DownloadNetworkErrorModalProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onClose}
      title={t('mfa.recoveryCodes.downloadNetworkError.title')}
      buttonText={t('mfa.recoveryCodes.downloadNetworkError.button')}
      hasSecondBtn={false}
      submitBtnColor="primary"
      data-testid="download-network-error-modal"
    >
      <StyledModalWrapper>
        {t('mfa.recoveryCodes.downloadNetworkError.description')}
      </StyledModalWrapper>
    </Modal>
  );
};
