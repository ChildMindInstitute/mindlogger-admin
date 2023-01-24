import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'components';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { StyledTitleMedium } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';

import { ClearScheduledEventsPopupProps } from './ClearScheduledEventsPopup.types';

export const ClearScheduledEventsPopup = ({
  open,
  onClose,
  name,
  appletName,
  isDefault = true,
}: ClearScheduledEventsPopupProps) => {
  const { t } = useTranslation();
  const [isCleared, setIsCleared] = useState(false);

  const onSubmit = () => {
    if (isCleared) {
      onClose();
    } else {
      setIsCleared(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(isCleared ? 'scheduleClearedSuccess' : 'clearScheduledEvents')}
      onSubmit={onSubmit}
      buttonText={t(isCleared ? 'ok' : 'clearAll')}
      submitBtnColor={isCleared ? 'primary' : 'error'}
      hasSecondBtn={!isCleared}
      secondBtnText={t('cancel')}
      width="66"
    >
      <StyledModalWrapper>
        {isCleared ? (
          <>
            {isDefault ? (
              <Trans i18nKey="clearEventsSuccess">
                <StyledTitleMedium>
                  Scheduled events within the <strong>default schedule</strong> for the Applet
                  <strong>
                    <>{{ appletName }} </>
                  </strong>
                  have been cleared successfully.
                </StyledTitleMedium>
                <StyledTitleMedium sx={{ marginTop: theme.spacing(2.4) }}>
                  Respondents' <strong>individual schedules</strong> (if applicable) have not
                  changed.
                </StyledTitleMedium>
              </Trans>
            ) : (
              <Trans i18nKey="clearIndividualScheduleSuccess">
                <StyledTitleMedium>
                  Please note that respondent
                  <strong>
                    <> {{ name }} </>
                  </strong>
                  is still using an <strong>individual schedule</strong>.
                </StyledTitleMedium>
                <StyledTitleMedium sx={{ marginTop: theme.spacing(2.4) }}>
                  You may revert this respondent back to the <strong>default schedule</strong> by
                  pressing the trash icon on the top-left.
                </StyledTitleMedium>
              </Trans>
            )}
          </>
        ) : (
          <StyledTitleMedium>
            {isDefault ? (
              <Trans i18nKey="confirmClearEvents">
                You are about to remove all scheduled events and their notifications from Applet
                <strong>
                  <> {{ appletName }} </>
                </strong>
                default schedule. Are you sure you want to continue?
              </Trans>
            ) : (
              <Trans i18nkey="confirmClearInvidividualSchedule">
                You are about to remove all scheduled events and their notifications from Applet
                <strong>
                  <> {{ appletName }} individual schedule</>
                </strong>
                . Are you sure you want to continue?
              </Trans>
            )}
          </StyledTitleMedium>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
