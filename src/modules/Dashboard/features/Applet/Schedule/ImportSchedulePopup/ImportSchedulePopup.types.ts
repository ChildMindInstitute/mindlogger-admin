import { ScheduleExportCsv, ScheduleExportItem } from '../Schedule.types';

export type ImportSchedulePopupProps = {
  isIndividual?: boolean;
  appletName: string;
  respondentId?: string;
  respondentName: string;
  open: boolean;
  onClose: () => void;
  onDownloadTemplate: () => void;
  scheduleExportData: ScheduleExportCsv;
  'data-testid'?: string;
};

type InvalidField = {
  data: null | JSX.Element;
  id: string;
};

export type CheckFields = {
  activityNames: string[];
  invalidStartTimeField: InvalidField;
  invalidEndTimeField: InvalidField;
  invalidNotification: InvalidField;
  invalidFrequency: InvalidField;
  invalidDate: InvalidField;
  invalidStartEndTime: InvalidField;
  invalidNotificationTime: InvalidField;
  hasInvalidData: boolean;
};

export type ImportScheduleHookProps = {
  appletName: string;
  scheduleExportData: ScheduleExportCsv;
};

export type UploadedEvent = Omit<ScheduleExportItem, 'date'> & {
  date: string | Date;
};

export enum ImportScheduleErrors {
  StartTime = 'startTime',
  EndTime = 'endTime',
  NotificationTime = 'notificationTime',
  Frequency = 'frequency',
  Date = 'date',
  StartEndTime = 'startEndTime',
  BetweenStartEndTime = 'betweenStartEndTime',
}

export type Steps = 0 | 1 | 2;
