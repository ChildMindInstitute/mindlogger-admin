import { Trans, useTranslation } from 'react-i18next';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { RemoveAllScheduledEventsPopupProps } from './RemoveAllScheduledEventsPopup.types';

export const RemoveAllScheduledEventsPopup = ({
  open,
  onClose,
  onSubmit,
  activityName,
  isLoading,
  'data-testid': dataTestid,
}: RemoveAllScheduledEventsPopupProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('removeAllScheduledEventsForActivity')}
      buttonText={t('remove')}
      submitBtnColor="error"
      hasSecondBtn
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
      disabledSubmit={isLoading}
      data-testid={`${dataTestid}-remove-all-scheduled-events-popup`}
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <Trans i18nKey="confirmRemoveAllScheduledEventsForActivity">
            All scheduled events for
            <strong>
              <> {{ activityName }} </>
            </strong>
            will be removed, and the activity will become always available to the user. Are you sure you want to
            continue?
          </Trans>
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
