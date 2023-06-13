import { Trans } from 'react-i18next';
import { endOfYear } from 'date-fns';
import { Box } from '@mui/material';

import i18n from 'i18n';
import { SingleApplet } from 'shared/state';
import { NotificationType, Periodicity, TimerType } from 'modules/Dashboard/api';

import { convertDateToYearMonthDay } from '../Schedule.utils';
import { ScheduleExportCsv } from '../Schedule.types';
import {
  getStartEndComparison,
  getBetweenStartEndComparison,
  addSecondsToHourMinutes,
} from '../EventForm/EventForm.utils';
import {
  frequencyArray,
  notificationValidationRegex,
  timeValidationRegex,
} from './ImportSchedule.const';
import { CheckFields, ImportScheduleErrors, UploadedEvent } from './ImportSchedulePopup.types';

const { t } = i18n;

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
        <>
          <Box>{t('importScheduleErrors.invalidDataFormat')}</Box>
          <Box>
            <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.StartTime}]`}>
              <strong>Activity Start Time</strong>. Valid data format:{' '}
              <strong>HH:mm for Scheduled activity and - for Always available activity</strong>.
            </Trans>
          </Box>
          <Box>{t('importScheduleErrors.updateReupload')}</Box>
        </>
      );
    case ImportScheduleErrors.EndTime:
      return (
        <>
          <Box>{t('importScheduleErrors.invalidDataFormat')}</Box>
          <Box>
            <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.EndTime}]`}>
              <strong>Activity End Time</strong>. Valid data format:{' '}
              <strong>HH:mm for Scheduled activity and - for Always available activity</strong>.
            </Trans>
          </Box>
          <Box>{t('importScheduleErrors.updateReupload')}</Box>
        </>
      );
    case ImportScheduleErrors.NotificationTime:
      return (
        <>
          <Box>{t('importScheduleErrors.invalidDataFormat')}</Box>
          <Box>
            <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.NotificationTime}]`}>
              <strong>Notification Time</strong>. Valid data format: <strong>HH:mm or -</strong>.
            </Trans>
          </Box>
          <Box>{t('importScheduleErrors.updateReupload')}</Box>
        </>
      );
    case ImportScheduleErrors.Frequency:
      return (
        <>
          <Box>{t('importScheduleErrors.invalidDataFormat')}</Box>
          <Box>
            <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.Frequency}]`}>
              <strong>Frequency</strong>. Valid data format:{' '}
              <strong>Always, Once, Daily, Weekly, Monthly, Weekdays</strong>.
            </Trans>
          </Box>
          <Box>{t('importScheduleErrors.updateReupload')}</Box>
        </>
      );
    case ImportScheduleErrors.Date:
      return (
        <>
          <Box>{t('importScheduleErrors.invalidDataFormat')}</Box>
          <Box>
            <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.Date}]`}>
              <strong>Date</strong>. Valid data format: <strong>dd MMM yyyy</strong>.
            </Trans>
          </Box>
          <Box>{t('importScheduleErrors.updateReupload')}</Box>
        </>
      );
    case ImportScheduleErrors.StartEndTime:
      return (
        <>
          <Box>
            <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.StartEndTime}]`}>
              <strong>Activity End Time</strong> should be greater than{' '}
              <strong>Activity Start Time</strong>.
            </Trans>
          </Box>
          <Box>{t('importScheduleErrors.updateReupload')}</Box>
        </>
      );
    case ImportScheduleErrors.BetweenStartEndTime:
      return (
        <>
          <Box>
            <Trans i18nKey={`importScheduleErrors[${ImportScheduleErrors.BetweenStartEndTime}]`}>
              <strong>Notification Time</strong> should be between{' '}
              <strong>Activity Start Time</strong> and <strong>Activity End Time</strong>.
            </Trans>
          </Box>
          <Box>{t('importScheduleErrors.updateReupload')}</Box>
        </>
      );
    default:
      return null;
  }
};

const getFieldsToCheck = (data: ScheduleExportCsv, isUploadedSchedule: boolean) =>
  data.reduce(
    (acc: CheckFields, { activityName, frequency, startTime, endTime, notificationTime, date }) => {
      acc.activityNames.push(activityName);

      if (isUploadedSchedule) {
        if (
          (frequency === 'Always' && startTime !== '-') ||
          (frequency !== 'Always' && !timeValidationRegex.test(startTime))
        ) {
          acc.invalidStartTimeField = getInvalidError(ImportScheduleErrors.StartTime);
        }

        if (
          (frequency === 'Always' && endTime !== '-') ||
          (frequency !== 'Always' && !timeValidationRegex.test(endTime))
        ) {
          acc.invalidEndTimeField = getInvalidError(ImportScheduleErrors.EndTime);
        }

        if (!notificationValidationRegex.test(notificationTime)) {
          acc.invalidNotification = getInvalidError(ImportScheduleErrors.NotificationTime);
        }

        if (!frequencyArray.includes(frequency)) {
          acc.invalidFrequency = getInvalidError(ImportScheduleErrors.Frequency);
        }

        if (!((date as unknown as Date) instanceof Date)) {
          acc.invalidDate = getInvalidError(ImportScheduleErrors.Date);
        }

        if (frequency !== 'Always' && !getStartEndComparison(startTime, endTime)) {
          acc.invalidStartEndTime = getInvalidError(ImportScheduleErrors.StartEndTime);
        }

        if (
          frequency !== 'Always' &&
          notificationTime !== '-' &&
          !getBetweenStartEndComparison(notificationTime, startTime, endTime)
        ) {
          acc.invalidNotificationTime = getInvalidError(ImportScheduleErrors.BetweenStartEndTime);
        }
      }

      return acc;
    },
    {
      activityNames: [],
      invalidStartTimeField: null,
      invalidEndTimeField: null,
      invalidNotification: null,
      invalidFrequency: null,
      invalidDate: null,
      invalidStartEndTime: null,
      invalidNotificationTime: null,
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
  const notExistentActivities = [...importedActivities].filter(
    (item) => !availableActivities.has(item),
  );

  return {
    ...props,
    notExistentActivities,
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
    const activityId = activity?.id;
    const flowId = flow?.id;

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
