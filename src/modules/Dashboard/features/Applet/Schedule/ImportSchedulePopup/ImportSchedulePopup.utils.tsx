import { Box } from '@mui/material';
import { endOfYear, format } from 'date-fns';
import { Trans } from 'react-i18next';

import { NotificationType, Periodicity, TimerType } from 'modules/Dashboard/api';
import { DateFormats, DEFAULT_API_START_TIME, DEFAULT_API_END_TIME } from 'shared/consts';
import { SingleApplet } from 'shared/state';

import { addSecondsToHourMinutes, getBetweenStartEndNextDaySingleComparison } from '../EventForm/EventForm.utils';
import { ScheduleExportCsv } from '../Schedule.types';
import { convertDateToYearMonthDay } from '../Schedule.utils';
import {
  dateValidationRegex,
  frequencyArray,
  notificationValidationRegex,
  timeValidationRegex,
  EMPTY_TIME,
  ALWAYS_FREQUENCY,
  commonErrorBoxProps,
} from './ImportSchedule.const';
import { CheckFields, ImportScheduleErrors, UploadedEvent } from './ImportSchedulePopup.types';

export const getInvalidActivitiesError = (activityNames: string[], appletName: string) =>
  activityNames.length === 1 ? (
    <Trans i18nKey="importScheduleErrors.invalidActivityName">
      Activity
      <strong>
        <>{{ activityName: activityNames[0] || '' }}</>
      </strong>
      does not exist in Applet
      <strong>
        <>{{ appletName }}</>
      </strong>
      . Please enter a valid Activity name and reupload the file.
    </Trans>
  ) : (
    <Trans i18nKey="importScheduleErrors.invalidActivityNames">
      Activities
      <strong>
        <>{{ activityNames: activityNames.join(', ') || '' }}</>
      </strong>
      do not exist in Applet
      <strong>
        <>{{ appletName }}</>
      </strong>
      . Please enter a valid Activity name and reupload the file.
    </Trans>
  );

export const getInvalidError = (type: ImportScheduleErrors) => {
  switch (type) {
    case ImportScheduleErrors.StartTime:
      return (
        <Box {...commonErrorBoxProps}>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.StartTime}]`}>
            <strong>Activity Start Time</strong>. Valid data format:{' '}
            <strong>HH:mm for Scheduled activity and - for Always available activity</strong>.
          </Trans>
        </Box>
      );
    case ImportScheduleErrors.EndTime:
      return (
        <Box {...commonErrorBoxProps}>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.EndTime}]`}>
            <strong>Activity End Time</strong>. Valid data format:{' '}
            <strong>HH:mm for Scheduled activity and - for Always available activity</strong>.
          </Trans>
        </Box>
      );
    case ImportScheduleErrors.NotificationTime:
      return (
        <Box {...commonErrorBoxProps}>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.NotificationTime}]`}>
            <strong>Notification Time</strong>. Valid data format: <strong>HH:mm or -</strong>.
          </Trans>
        </Box>
      );
    case ImportScheduleErrors.Frequency:
      return (
        <Box {...commonErrorBoxProps}>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.Frequency}]`}>
            <strong>Frequency</strong>. Valid data format:{' '}
            <strong>Always, Once, Daily, Weekly, Monthly, Weekdays</strong>.
          </Trans>
        </Box>
      );
    case ImportScheduleErrors.Date:
      return (
        <Box {...commonErrorBoxProps}>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.Date}]`}>
            <strong>Date</strong>. Valid data format: <strong>DD Month YYYY</strong>.
          </Trans>
        </Box>
      );
    case ImportScheduleErrors.StartEndTime:
      return (
        <Box {...commonErrorBoxProps}>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.StartEndTime}]`}>
            <strong>Activity End Time</strong> should not be equal to <strong>Activity Start Time</strong>.
          </Trans>
        </Box>
      );
    case ImportScheduleErrors.BetweenStartEndTime:
      return (
        <Box {...commonErrorBoxProps}>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.BetweenStartEndTime}]`}>
            <strong>Notification Time</strong> should be between <strong>Activity Start Time</strong> and{' '}
            <strong>Activity End Time</strong>.
          </Trans>
        </Box>
      );
    default:
      return null;
  }
};

const getUploadedDate = (date: string | Date) => {
  if (date instanceof Date) {
    return date;
  }
  if (dateValidationRegex.test(date)) {
    return new Date(date);
  }

  return date;
};

const getUploadedTime = (time: string | Date) => {
  if (time instanceof Date) {
    return format(time, DateFormats.Time);
  }

  //if the time format is H:mm getStartEndComparison makes invalid date
  return time.replace(/^[0-9]:/, (match) => `0${match}`);
};

const getFieldsToCheck = (data: ScheduleExportCsv, isUploadedSchedule: boolean) =>
  data.reduce(
    (acc: CheckFields, { activityName, frequency, startTime, endTime, notificationTime, date }) => {
      acc.activityNames.push(activityName);

      if (isUploadedSchedule) {
        const isAlwaysFrequency = frequency === ALWAYS_FREQUENCY;
        if (
          (isAlwaysFrequency && startTime !== EMPTY_TIME) ||
          (!isAlwaysFrequency && !timeValidationRegex.test(getUploadedTime(startTime)))
        ) {
          acc.invalidStartTimeField.data = getInvalidError(ImportScheduleErrors.StartTime);
          acc.hasInvalidData = true;
        }

        if (
          (isAlwaysFrequency && endTime !== EMPTY_TIME) ||
          (!isAlwaysFrequency && !timeValidationRegex.test(getUploadedTime(endTime)))
        ) {
          acc.invalidEndTimeField.data = getInvalidError(ImportScheduleErrors.EndTime);
          acc.hasInvalidData = true;
        }

        if (!notificationValidationRegex.test(getUploadedTime(notificationTime))) {
          acc.invalidNotification.data = getInvalidError(ImportScheduleErrors.NotificationTime);
          acc.hasInvalidData = true;
        }

        if (!frequencyArray.includes(frequency)) {
          acc.invalidFrequency.data = getInvalidError(ImportScheduleErrors.Frequency);
          acc.hasInvalidData = true;
        }

        if (!(getUploadedDate(date) instanceof Date)) {
          acc.invalidDate.data = getInvalidError(ImportScheduleErrors.Date);
          acc.hasInvalidData = true;
        }

        if (!isAlwaysFrequency && startTime === endTime) {
          acc.invalidStartEndTime.data = getInvalidError(ImportScheduleErrors.StartEndTime);
          acc.hasInvalidData = true;
        }

        if (
          !isAlwaysFrequency &&
          notificationTime !== EMPTY_TIME &&
          startTime !== endTime &&
          !getBetweenStartEndNextDaySingleComparison({
            time: getUploadedTime(notificationTime),
            rangeStartTime: getUploadedTime(startTime),
            rangeEndTime: getUploadedTime(endTime),
          })
        ) {
          acc.invalidNotificationTime.data = getInvalidError(ImportScheduleErrors.BetweenStartEndTime);
          acc.hasInvalidData = true;
        }
      }

      return acc;
    },
    {
      activityNames: [],
      invalidStartTimeField: { data: null, id: 'invalid-start-time' },
      invalidEndTimeField: { data: null, id: 'invalid-end-time' },
      invalidNotification: { data: null, id: 'invalid-notification' },
      invalidFrequency: { data: null, id: 'invalid-frequency' },
      invalidDate: { data: null, id: 'invalid-date' },
      invalidStartEndTime: { data: null, id: 'invalid-start-end-time' },
      invalidNotificationTime: { data: null, id: 'invalid-notification-time' },
      hasInvalidData: false,
    },
  );

export const getUploadedScheduleErrors = (
  currentSchedule: ScheduleExportCsv,
  uploadedSchedule?: Record<string, string | number>[],
) => {
  if (!uploadedSchedule) return null;

  const { activityNames: importedActivityNames, ...props } = getFieldsToCheck(
    uploadedSchedule as ScheduleExportCsv,
    true,
  );

  const importedActivities = new Set(importedActivityNames);
  const availableActivities = new Set(getFieldsToCheck(currentSchedule, false).activityNames);
  const notExistentActivities = [...importedActivities].filter((item) => !availableActivities.has(item));

  return {
    ...props,
    notExistentActivities,
  };
};

const getEndOfYearDate = (uploadedDate: Date) => endOfYear(uploadedDate < new Date() ? new Date() : uploadedDate);

export const prepareImportPayload = (
  uploadedEvents: UploadedEvent[],
  scheduleExportData: ScheduleExportCsv,
  appletData?: SingleApplet,
  respondentId?: string,
) =>
  uploadedEvents?.map(({ date, endTime, startTime, notificationTime, frequency, activityName }) => {
    const periodicityType = frequency.toUpperCase() as Periodicity;
    const activity = appletData?.activities?.find((activity) => activity.name === activityName);
    const flow = appletData?.activityFlows?.find((flow) => flow.name === activityName);
    const activityId = activity?.id;
    const flowId = flow?.id;
    const uploadedDate = getUploadedDate(date);

    return {
      startTime:
        startTime === EMPTY_TIME
          ? DEFAULT_API_START_TIME
          : addSecondsToHourMinutes(getUploadedTime(startTime)) || undefined,
      endTime:
        endTime === EMPTY_TIME ? DEFAULT_API_END_TIME : addSecondsToHourMinutes(getUploadedTime(endTime)) || undefined,
      accessBeforeSchedule: periodicityType === Periodicity.Always ? undefined : false,
      oneTimeCompletion: periodicityType === Periodicity.Always ? false : undefined,
      timerType: TimerType.NotSet,
      respondentId,
      periodicity: {
        type: periodicityType,
        ...(uploadedDate instanceof Date && {
          selectedDate:
            periodicityType === Periodicity.Once ||
            periodicityType === Periodicity.Weekly ||
            periodicityType === Periodicity.Monthly
              ? convertDateToYearMonthDay(uploadedDate)
              : undefined,
          startDate: periodicityType === Periodicity.Once ? undefined : convertDateToYearMonthDay(uploadedDate),
          endDate:
            periodicityType === Periodicity.Once
              ? undefined
              : convertDateToYearMonthDay(getEndOfYearDate(uploadedDate)),
        }),
      },
      activityId,
      flowId,
      notification:
        notificationTime === EMPTY_TIME
          ? null
          : {
              notifications: [
                {
                  triggerType: NotificationType.Fixed,
                  atTime: addSecondsToHourMinutes(getUploadedTime(notificationTime)),
                },
              ],
              reminder: null,
            },
    };
  });
