import { Fragment } from 'react';

import i18n from 'i18n';
import { Svg } from 'components';

import { Counter } from './Counter';
import { StyledCreateBtn, StyledDeactivated, StyledIndicator } from './Legend.styles';
import { getScheduledIndicatorColor, getScheduledTitle } from './Legend.utils';

const { t } = i18n;

export const Schedules = {
  DailyJournal: 'dailyJournal',
  PreQuestionnaire: 'preQuestionnaire',
  MorningAssessment: 'morningAssessment',
  MiddayAssessment: 'middayAssessment',
  EveningAssessment: 'eveningAssessment',
} as const;

export const ScheduleOptions = {
  DefaultSchedule: 'defaultSchedule',
  IndividualSchedule: 'individualSchedule',
} as const;

export const scheduleOptions = [
  {
    labelKey: ScheduleOptions.DefaultSchedule,
    value: ScheduleOptions.DefaultSchedule,
    icon: <Svg id="calendar" />,
  },
  {
    labelKey: ScheduleOptions.IndividualSchedule,
    value: ScheduleOptions.IndividualSchedule,
    icon: <Svg id="user-calendar" />,
  },
];
// TODO check translations after api connect
export const availableItems = [<>Emotional Support</>, <>Incentive Activity</>];

export const deactivatedItems = [<StyledDeactivated>Draft 6</StyledDeactivated>];

export const scheduledItems = [
  <>
    <Svg id="add" width={20} height={20} />
    <StyledCreateBtn>{t('createEvent')}</StyledCreateBtn>
  </>,
  ...Object.values(Schedules).map((el) => (
    <Fragment key={el}>
      <StyledIndicator colors={getScheduledIndicatorColor(el)} />
      {getScheduledTitle(el)}
      <Counter count={1} />
    </Fragment>
  )),
];

export const getExpandedLists = () => {
  const commonProps = { width: 18, height: 18 };

  return [
    {
      buttons: [
        { icon: <Svg id="clear-calendar" {...commonProps} />, action: () => null },
        { icon: <Svg id="visibility-on" {...commonProps} />, action: () => null },
      ],
      items: scheduledItems,
      title: t('scheduled'),
    },
    {
      buttons: [{ icon: <Svg id="visibility-off" {...commonProps} />, action: () => null }],
      items: availableItems,
      title: t('alwaysAvailable'),
    },
    {
      buttons: [{ icon: <Svg id="external-link" {...commonProps} />, action: () => null }],
      items: deactivatedItems,
      title: t('deactivated'),
    },
  ];
};
