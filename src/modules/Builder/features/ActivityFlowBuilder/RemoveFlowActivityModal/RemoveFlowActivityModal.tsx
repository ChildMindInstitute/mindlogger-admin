import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { RemoveFlowActivityModalProps } from './RemoveFlowActivityModal.types';

export const RemoveFlowActivityModal = ({
  activityName,
  isOpen,
  onModalClose,
  onModalSubmit,
}: RemoveFlowActivityModalProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={isOpen}
      onClose={onModalClose}
      onSubmit={onModalSubmit}
      onSecondBtnSubmit={onModalClose}
      title={t('removeActivity')}
      buttonText={t('remove')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid="builder-activity-flows-builder-remove-popup">
      <StyledModalWrapper>
        <Trans i18nKey="removeActivityDescription">
          Are you sure you want to remove Activity
          <strong>
            <>{{ activityName }}</>
          </strong>
          from the Activity Flow?
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
