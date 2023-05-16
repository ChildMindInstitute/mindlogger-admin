import { Trans } from 'react-i18next';
import { endOfYear } from 'date-fns';

import i18n from 'i18n';
import { SingleApplet } from 'shared/state';
import { NotificationType, Periodicity, TimerType } from 'modules/Dashboard/api';

import { ScheduleExportCsv } from '../Schedule.types';
import {
  getStartEndComparison,
  getBetweenStartEndComparison,
  addSecondsToHourMinutes,
  convertDateToYearMonthDay,
} from '../EventForm/EventForm.utils';
import { notificationValidationRegex, timeValidationRegex } from './ImportSchedule.const';
import { ImportScheduleErrors, UploadedEvent } from './ImportSchedulePopup.types';

const { t } = i18n;

export const getInvalidActivitiesError = (activityNames: string[], appletName: string) =>
  activityNames.length === 1 ? (
    <Trans i18nKey="importScheduleErrors.invalidActivityName">
      Activity
      <strong>
        <>[{{ activityName: activityNames[0] || '' }}]</>
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
        <>[{{ activityNames: activityNames.join(', ') || '' }}]</>
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
        <>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.StartTime}]`}>
            <strong>Activity Start Time</strong>. Valid data format:{' '}
            <strong>HH:mm for Scheduled activity and - for Always available activity</strong>.
          </Trans>{' '}
          {t('importScheduleErrors.updateReupload')}
        </>
      );
    case ImportScheduleErrors.EndTime:
      return (
        <>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.EndTime}]`}>
            <strong>Activity End Time</strong>. Valid data format:{' '}
            <strong>HH:mm for Scheduled activity and - for Always available activity</strong>.
          </Trans>{' '}
          {t('importScheduleErrors.updateReupload')}
        </>
      );
    case ImportScheduleErrors.NotificationTime:
      return (
        <>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.NotificationTime}]`}>
            <strong>Notification Time</strong>. Valid data format: <strong>HH:mm or -</strong>.
          </Trans>{' '}
          {t('importScheduleErrors.updateReupload')}
        </>
      );
    case ImportScheduleErrors.Frequency:
      return (
        <>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.Frequency}]`}>
            <strong>Frequency</strong>. Valid data format:{' '}
            <strong>Always, Once, Daily, Weekly, Monthly, Weekdays</strong>.
          </Trans>{' '}
          {t('importScheduleErrors.updateReupload')}
        </>
      );
    case ImportScheduleErrors.Date:
      return (
        <>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.Date}]`}>
            <strong>Date</strong>. Valid data format: <strong>dd MMM yyyy</strong>.
          </Trans>{' '}
          {t('importScheduleErrors.updateReupload')}
        </>
      );
    case ImportScheduleErrors.StartEndTime:
      return (
        <>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.StartEndTime}]`}>
            <strong>Activity End Time</strong> should be greater than{' '}
            <strong>Activity Start Time</strong>. Please update and reupload the file.
          </Trans>{' '}
          {t('importScheduleErrors.updateReupload')}
        </>
      );
    case ImportScheduleErrors.BetweenStartEndTime:
      return (
        <>
          <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.BetweenStartEndTime}]`}>
            <strong>Notification Time</strong> should be between{' '}
            <strong>Activity Start Time</strong> and <strong>Activity End Time</strong>. Please
            update and reupload the file.
          </Trans>{' '}
          {t('importScheduleErrors.updateReupload')}
        </>
      );
    default:
      return null;
  }
};

const getActivitiesFieldsToCheck = (data: ScheduleExportCsv, isUploadedSchedule: boolean) =>
  data.reduce(
    (
      acc: {
        activityNames: string[];
        hasInvalidStartTimeField: boolean;
        hasInvalidEndTimeField: boolean;
        hasInvalidNotification: boolean;
        hasInvalidFrequency: boolean;
        hasInvalidDate: boolean;
        hasInvalidStartEndTime: boolean;
        hasInvalidNotificationTime: boolean;
      },
      { activityName, frequency, startTime, endTime, notificationTime, date },
    ) => {
      acc.activityNames.push(activityName);

      if (isUploadedSchedule) {
        if (
          (frequency === 'Always' && startTime !== '-') ||
          (frequency !== 'Always' && !timeValidationRegex.test(startTime))
        ) {
          acc.hasInvalidStartTimeField = true;
        }

        if (
          (frequency === 'Always' && endTime !== '-') ||
          (frequency !== 'Always' && !timeValidationRegex.test(endTime))
        ) {
          acc.hasInvalidEndTimeField = true;
        }

        if (!notificationValidationRegex.test(notificationTime)) {
          acc.hasInvalidNotification = true;
        }

        if (!['Always', 'Once', 'Daily', 'Weekly', 'Monthly', 'Weekdays'].includes(frequency)) {
          acc.hasInvalidFrequency = true;
        }

        if (!((date as unknown as Date) instanceof Date)) {
          acc.hasInvalidDate = true;
        }

        if (frequency !== 'Always' && !getStartEndComparison(startTime, endTime)) {
          acc.hasInvalidStartEndTime = true;
        }

        if (
          frequency !== 'Always' &&
          notificationTime !== '-' &&
          !getBetweenStartEndComparison(notificationTime, startTime, endTime)
        ) {
          acc.hasInvalidNotificationTime = true;
        }
      }

      return acc;
    },
    {
      activityNames: [],
      hasInvalidStartTimeField: false,
      hasInvalidEndTimeField: false,
      hasInvalidNotification: false,
      hasInvalidFrequency: false,
      hasInvalidDate: false,
      hasInvalidStartEndTime: false,
      hasInvalidNotificationTime: false,
    },
  );

export const getUploadedScheduleErrors = (
  currentSchedule: ScheduleExportCsv,
  uploadedSchedule?: Record<string, string | number>[],
) => {
  if (!uploadedSchedule) return null;

  const {
    activityNames: importedActivityNames,
    hasInvalidStartTimeField,
    hasInvalidEndTimeField,
    hasInvalidNotification,
    hasInvalidFrequency,
    hasInvalidDate,
    hasInvalidStartEndTime,
    hasInvalidNotificationTime,
  } = getActivitiesFieldsToCheck(uploadedSchedule as ScheduleExportCsv, true);

  const importedActivities = new Set(importedActivityNames);
  const availableActivities = new Set(
    getActivitiesFieldsToCheck(currentSchedule, false).activityNames,
  );
  const notExistentActivities = [...importedActivities].filter(
    (item) => !availableActivities.has(item),
  );

  return {
    notExistentActivities,
    hasInvalidStartTimeField,
    hasInvalidEndTimeField,
    hasInvalidNotification,
    hasInvalidFrequency,
    hasInvalidDate,
    hasInvalidStartEndTime,
    hasInvalidNotificationTime,
  };
};

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
    const activityId = activity?.id || undefined;
    const flowId = flow?.id || undefined;

    return {
      startTime: startTime === '-' ? undefined : addSecondsToHourMinutes(startTime) || undefined,
      endTime: endTime === '-' ? undefined : addSecondsToHourMinutes(endTime) || undefined,
      accessBeforeSchedule: periodicityType === Periodicity.Always ? undefined : false,
      oneTimeCompletion: periodicityType === Periodicity.Always ? false : undefined,
      timerType: TimerType.NotSet,
      respondentId,
      periodicity: {
        type: periodicityType,
        selectedDate:
          periodicityType === Periodicity.Once ||
          periodicityType === Periodicity.Weekly ||
          periodicityType === Periodicity.Monthly
            ? convertDateToYearMonthDay(date)
            : undefined,
        startDate:
          periodicityType === Periodicity.Once ? undefined : convertDateToYearMonthDay(date),
        endDate:
          periodicityType === Periodicity.Once
            ? undefined
            : convertDateToYearMonthDay(endOfYear(date)),
      },
      activityId,
      flowId,
      notification:
        notificationTime === '-'
          ? null
          : {
              notifications: [
                {
                  triggerType: NotificationType.Fixed,
                  atTime: addSecondsToHourMinutes(notificationTime),
                },
              ],
              reminder: null,
            },
    };
  });
