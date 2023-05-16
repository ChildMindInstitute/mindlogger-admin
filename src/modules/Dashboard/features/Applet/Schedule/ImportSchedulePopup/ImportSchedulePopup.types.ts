import { ScheduleExportCsv, ScheduleExportItem } from '../Schedule.types';

export type ImportSchedulePopupProps = {
  isIndividual?: boolean;
  appletName: string;
  respondentName: string;
  open: boolean;
  onClose: () => void;
  onDownloadTemplate: () => void;
  scheduleExportData: ScheduleExportCsv;
};

export type ImportScheduleHookProps = {
  appletName: string;
  scheduleExportData: ScheduleExportCsv;
};

export type UploadedEvent = Omit<ScheduleExportItem, 'date'> & {
  date: Date;
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
