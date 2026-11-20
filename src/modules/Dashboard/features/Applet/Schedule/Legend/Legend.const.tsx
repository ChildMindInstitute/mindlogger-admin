import { format } from 'date-fns';

import { Svg } from 'shared/components/Svg';
import { DateFormats } from 'shared/consts';

import { EXAMPLE_ROW_PREFIX } from '../ImportSchedulePopup/ImportSchedule.const';
import { ScheduleExportCsv } from '../Schedule.types';

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
  'oneTimeCompletion',
];

// Template-only rows that show the formats; import ignores them
export const getScheduleTemplateExampleRows = (): ScheduleExportCsv => {
  const date = format(new Date(), DateFormats.DayMonthYear);

  return [
    {
      activityName: `${EXAMPLE_ROW_PREFIX} Example: Daily with 2 notifications`,
      date,
      startTime: '09:00',
      endTime: '17:00',
      notificationTime: '09:00;13:30',
      frequency: 'Daily',
      oneTimeCompletion: '-',
    },
    {
      activityName: `${EXAMPLE_ROW_PREFIX} Example: Always available`,
      date,
      startTime: '-',
      endTime: '-',
      notificationTime: '-',
      frequency: 'Always',
      oneTimeCompletion: 'TRUE',
    },
  ];
};
