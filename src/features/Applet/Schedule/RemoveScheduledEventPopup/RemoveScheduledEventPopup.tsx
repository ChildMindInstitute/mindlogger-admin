import { Modal } from 'components';
import { Trans, useTranslation } from 'react-i18next';

import { StyledModalWrapper } from 'styles/styledComponents';

import { RemoveScheduledEventPopupProps } from './RemoveScheduledEventPopup.types';

export const RemoveScheduledEventPopup = ({
  open,
  onClose,
  onSubmit,
  activityName,
}: RemoveScheduledEventPopupProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('removeScheduledEvent')}
      buttonText={t('remove')}
      submitBtnColor="error"
      hasSecondBtn
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
    >
      <StyledModalWrapper>
        <Trans i18nKey="confirmRemoveScheduledEvent">
          Are you sure you want to remove this scheduled event for Activity
          <strong>
            <> {{ activityName }}</>
          </strong>
          ?
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
