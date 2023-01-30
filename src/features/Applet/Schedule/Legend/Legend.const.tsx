import { Svg } from 'components';

export const Schedules = {
  DailyJournal: 'dailyJournal',
  PreQuestionnaire: 'preQuestionnaire',
  MorningAssessment: 'morningAssessment',
  MiddayAssessment: 'middayAssessment',
  EveningAssessment: 'eveningAssessment',
} as const;

export const Available = {
  EmotionalSupport: 'emotionalSupport',
  IncentiveActivity: 'incentiveActivity',
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
