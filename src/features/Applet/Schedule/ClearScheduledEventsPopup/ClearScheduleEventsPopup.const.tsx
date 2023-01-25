import { Trans } from 'react-i18next';

import { StyledTitleMedium } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';

import { ScreensParams } from './ClearScheduledEventsPopup.types';

const getFirstScreen = (appletName: string) => (
  <StyledTitleMedium>
    <Trans i18nKey="confirmClearEvents">
      You are about to remove all scheduled events and their notifications from Applet
      <strong>
        <> {{ appletName }} </>
      </strong>
      default schedule. Are you sure you want to continue?
    </Trans>
  </StyledTitleMedium>
);

const getFirstScreenForIndividualSchedule = (appletName: string) => (
  <StyledTitleMedium>
    <Trans i18nkey="confirmClearInvidividualSchedule">
      You are about to remove all scheduled events and their notifications from Applet
      <strong>
        <> {{ appletName }} individual schedule</>
      </strong>
      . Are you sure you want to continue?
    </Trans>
  </StyledTitleMedium>
);

const getSecondScreen = (appletName: string) => (
  <Trans i18nKey="clearEventsSuccess">
    <StyledTitleMedium>
      Scheduled events within the <strong>default schedule</strong> for the Applet
      <strong>
        <>{{ appletName }} </>
      </strong>
      have been cleared successfully.
    </StyledTitleMedium>
    <StyledTitleMedium sx={{ marginTop: theme.spacing(2.4) }}>
      Respondents' <strong>individual schedules</strong> (if applicable) have not changed.
    </StyledTitleMedium>
  </Trans>
);

const getSecondScreenForIndividualSchedule = (appletName: string, name: string) => (
  <Trans i18nKey="clearIndividualScheduleSuccess">
    <StyledTitleMedium>
      Please note that respondent
      <strong>
        <> {{ name }} </>
      </strong>
      is still using an <strong>individual schedule</strong>.
    </StyledTitleMedium>
    <StyledTitleMedium sx={{ marginTop: theme.spacing(2.4) }}>
      You may revert this respondent back to the <strong>default schedule</strong> by pressing the
      trash icon on the top-left.
    </StyledTitleMedium>
  </Trans>
);

export const getScreens = ({ appletName, name, isDefault, onSubmit, onClose }: ScreensParams) => [
  {
    component: (isDefault ? getFirstScreen : getFirstScreenForIndividualSchedule)(appletName),
    buttonText: 'clearAll',
    title: 'clearScheduledEvents',
    hasSecondBtn: true,
    onSubmit,
    submitBtnColor: 'error',
  },
  {
    component: isDefault
      ? getSecondScreen(appletName)
      : getSecondScreenForIndividualSchedule(appletName, name as string),
    buttonText: 'ok',
    title: 'scheduleClearedSuccess',
    onSubmit: onClose,
  },
];
