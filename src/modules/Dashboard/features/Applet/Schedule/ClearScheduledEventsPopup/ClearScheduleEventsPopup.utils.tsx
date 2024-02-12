import { Trans } from 'react-i18next';

import { StyledTitleMedium } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { ScreensParams } from './ClearScheduledEventsPopup.types';

const getFirstScreen = (appletName: string) => (
  <StyledTitleMedium>
    <Trans i18nKey="confirmClearEvents">
      You are about to remove all scheduled events and notifications from the
      <strong> default schedule</strong> for Applet
      <strong>
        <> {{ appletName }}</>
      </strong>
      . Are you sure you want to continue?
    </Trans>
  </StyledTitleMedium>
);

const getFirstScreenForIndividualSchedule = (name: string) => (
  <StyledTitleMedium>
    <Trans i18nKey="confirmClearIndividualSchedule">
      You are about to remove all scheduled events and notifications from the
      <strong> individual schedule</strong> for Respondent
      <strong>
        <> {{ name }}</>
      </strong>
      . Are you sure you want to continue?
    </Trans>
  </StyledTitleMedium>
);

const getSecondScreen = (appletName: string) => (
  <Trans i18nKey="clearEventsSuccess">
    <StyledTitleMedium>
      Scheduled events within the <strong>default scheduled</strong> for Applet
      <strong>
        <> {{ appletName }} </>
      </strong>
      have been successfully cleared.
    </StyledTitleMedium>
    <StyledTitleMedium sx={{ marginTop: theme.spacing(2.4) }}>
      Respondents' <strong>individual schedules</strong> (if applicable) have not changed.
    </StyledTitleMedium>
  </Trans>
);

const getSecondScreenForIndividualSchedule = (name: string) => (
  <Trans i18nKey="clearIndividualScheduleSuccess">
    <StyledTitleMedium>
      Please note that Respondent
      <strong>
        <> {{ name }} </>
      </strong>
      is still using an <strong>individual schedule</strong>.
    </StyledTitleMedium>
    <StyledTitleMedium sx={{ marginTop: theme.spacing(2.4) }}>
      You may revert this Respondent back to the <strong>default schedule</strong> by pressing the
      trash icon on the top-left.
    </StyledTitleMedium>
  </Trans>
);

export const getScreens = ({ appletName, name, isDefault, onSubmit, onClose }: ScreensParams) => [
  {
    component: isDefault
      ? getFirstScreen(appletName)
      : getFirstScreenForIndividualSchedule(name as string),
    buttonText: 'clearAll',
    title: 'clearScheduledEvents',
    hasSecondBtn: true,
    onSubmit,
    submitBtnColor: 'error',
  },
  {
    component: isDefault
      ? getSecondScreen(appletName)
      : getSecondScreenForIndividualSchedule(name as string),
    buttonText: 'ok',
    title: 'scheduleClearedSuccess',
    onSubmit: onClose,
  },
];
