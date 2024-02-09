import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { DeleteActivityModalProps } from './DeleteActivityModal.types';

export const DeleteActivityModal = ({
  isOpen,
  onModalClose,
  onModalSubmit,
  activityName,
  'data-testid': dataTestid,
}: DeleteActivityModalProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={isOpen}
      onClose={onModalClose}
      onSubmit={onModalSubmit}
      onSecondBtnSubmit={onModalClose}
      title={t('deleteActivity')}
      buttonText={t('delete')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        <Trans i18nKey="deleteActivityDescription">
          Are you sure you want to delete the Activity
          <strong>
            <>{{ activityName }}</>
          </strong>
          ?
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
