import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { ClearFlowModalProps } from './ClearFlowModal.types';

export const ClearFlowModal = ({ isOpen, onModalClose, onModalSubmit }: ClearFlowModalProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={isOpen}
      onClose={onModalClose}
      onSubmit={onModalSubmit}
      onSecondBtnSubmit={onModalClose}
      title={t('clearActivityFlow')}
      buttonText={t('clear')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid="builder-activity-flows-builder-clear-popup"
    >
      <StyledModalWrapper>{t('clearActivityFlowDescription')}</StyledModalWrapper>
    </Modal>
  );
};
