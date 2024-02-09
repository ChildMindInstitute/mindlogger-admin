import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { DeleteFlowModalProps } from './DeleteFlowModal.types';

export const DeleteFlowModal = ({ activityFlowName, isOpen, onModalClose, onModalSubmit }: DeleteFlowModalProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={isOpen}
      onClose={onModalClose}
      onSubmit={onModalSubmit}
      onSecondBtnSubmit={onModalClose}
      title={t('deleteActivityFlow')}
      buttonText={t('delete')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid="builder-activity-flows-remove-popup"
    >
      <StyledModalWrapper>
        <Trans i18nKey="deleteActivityFlowDescription">
          Are you sure you want to delete the Activity Flow
          <strong>
            <>{{ activityFlowName }}</>
          </strong>
          ?
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
