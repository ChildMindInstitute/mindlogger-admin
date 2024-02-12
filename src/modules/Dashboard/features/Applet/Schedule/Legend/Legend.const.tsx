import { Svg } from 'shared/components/Svg';

export const ScheduleOptions = {
  DefaultSchedule: 'defaultSchedule',
  IndividualSchedule: 'individualSchedule',
} as const;

export const scheduleOptions = [
  {
    labelKey: ScheduleOptions.DefaultSchedule,
    value: ScheduleOptions.DefaultSchedule,
    icon: <Svg id="calendar" />,
    groupKey: 'selectScheduleType',
    'data-testid': 'dashboard-calendar-schedule-default',
  },
  {
    labelKey: ScheduleOptions.IndividualSchedule,
    value: ScheduleOptions.IndividualSchedule,
    icon: <Svg id="user-calendar" />,
    groupKey: 'selectScheduleType',
    'data-testid': 'dashboard-calendar-schedule-individual',
  },
];

export const enum ExpandedListTypes {
  Scheduled = 'scheduled',
  AlwaysAvailable = 'always-available',
  Deactivated = 'deactivated',
}

export const defaultExportHeader = [
  'activityName',
  'date',
  'startTime',
  'endTime',
  'notificationTime',
  'frequency',
];
