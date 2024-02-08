import { Trans, useTranslation } from 'react-i18next';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { RemoveScheduledEventPopupProps } from './RemoveScheduledEventPopup.types';

export const RemoveScheduledEventPopup = ({
  open,
  onClose,
  onSubmit,
  activityName,
  isLoading,
  'data-testid': dataTestid,
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
      disabledSubmit={isLoading}
      data-testid={dataTestid}>
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <Trans i18nKey="confirmRemoveScheduledEvent">
            Are you sure you want to remove this scheduled event for
            <strong>
              <> {{ activityName }}</>
            </strong>
            ?
          </Trans>
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
