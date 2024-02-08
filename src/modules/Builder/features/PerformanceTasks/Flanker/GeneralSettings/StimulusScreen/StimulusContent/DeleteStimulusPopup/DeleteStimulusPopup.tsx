import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { DeleteStimulusPopupProps } from './DeleteStimulusPopup.types';

export const DeleteStimulusPopup = ({ isOpen, onModalClose, onModalSubmit, imageName }: DeleteStimulusPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={isOpen}
      onClose={onModalClose}
      onSubmit={onModalSubmit}
      onSecondBtnSubmit={onModalClose}
      title={t('flankerStimulus.deleteTitle')}
      buttonText={t('delete')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid="builder-activity-flanker-stimulus-screen-delete-popup">
      <StyledModalWrapper sx={{ wordBreak: 'break-word' }}>
        <Trans i18nKey="flankerStimulus.deleteDescription">
          Are you sure you want to delete the Stimulus Screen
          <strong>
            <>{{ imageName }}</>
          </strong>
          ? You will need to re-upload the Block Sequences.
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
