import { Trans } from 'react-i18next';

import { StyledTitleMedium } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';

import { ScreensParams } from './RemoveIndividualSchedule.types';

const getSecondScreen = (name: string) => (
  <StyledTitleMedium>
    <Trans i18nKey="removeIndividualScheduleSuccess">
      Respondent
      <strong>
        <>{{ name }}</>
      </strong>
      is now using the
      <strong>default schedule</strong>. You may add an individual schedule for this respondent
      again any time.
    </Trans>
  </StyledTitleMedium>
);

const getFirstScreenForEmptySchedule = (name: string) => (
  <StyledTitleMedium>
    <Trans i18nKey="confirmRemoveEmptyIndividualSchedule">
      Respondent
      <strong>
        <> {{ name }}’s individual schedule </>
      </strong>
      will be removed, and the respondent will use the <strong>default schedule</strong> instead.
      Are you sure you want to continue?
    </Trans>
  </StyledTitleMedium>
);

const getFirstScreen = (name: string) => (
  <Trans i18nKey="confirmRemoveIndividualSchedule">
    <StyledTitleMedium>
      You are about to remove Respondent
      <strong>
        <> {{ name }}’s individual schedule </>
      </strong>
      and move the respondent to a group of respondents that use the
      <strong> default schedule</strong>. All individually scheduled activities and their
      notifications will be lost.
    </StyledTitleMedium>
    <StyledTitleMedium sx={{ marginTop: theme.spacing(2.4) }}>
      Are you sure you want to continue?
    </StyledTitleMedium>
  </Trans>
);

export const getScreens = ({ name, isEmpty, onSubmit, onClose }: ScreensParams) => [
  {
    component: (isEmpty ? getFirstScreenForEmptySchedule : getFirstScreen)(name),
    buttonText: 'remove',
    title: 'removeIndividualSchedule',
    hasSecondBtn: true,
    onSubmit,
    submitBtnColor: 'error',
  },
  {
    component: getSecondScreen(name),
    buttonText: 'ok',
    title: 'individualScheduleRemoved',
    onSubmit: onClose,
  },
];
