import { ScheduleExportCsv, ScheduleExportItem } from '../Schedule.types';

export type ImportSchedulePopupProps = {
  isIndividual?: boolean;
  appletName: string;
  respondentName: string;
  open: boolean;
  onClose: () => void;
  onDownloadTemplate: () => void;
  scheduleExportData: ScheduleExportCsv;
  'data-testid'?: string;
};

export type CheckFields = {
  activityNames: string[];
  invalidStartTimeField: null | JSX.Element;
  invalidEndTimeField: null | JSX.Element;
  invalidNotification: null | JSX.Element;
  invalidFrequency: null | JSX.Element;
  invalidDate: null | JSX.Element;
  invalidStartEndTime: null | JSX.Element;
  invalidNotificationTime: null | JSX.Element;
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
