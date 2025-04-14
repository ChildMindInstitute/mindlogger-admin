import { DateTime, IANAZone, Interval } from 'luxon';

import {
  DeviceScheduleHistoryData,
  getDeviceScheduleHistory,
  getScheduleHistory,
  getWorkspaceRespondentsApi,
  ScheduleHistoryData,
} from 'modules/Dashboard/api';
import { ParticipantWithDataAccess } from 'modules/Dashboard/types';
import { DataExporter, DataExporterOptions } from 'shared/utils/exportData/exporters/DataExporter';
import { groupBy } from 'shared/utils/array';

export type ScheduleHistoryExportRow = {
  applet_id: string;
  applet_version: string;
  user_id: string;
  target_or_source_id: string;
  schedule_id: string;
  schedule_type: ScheduleHistoryData['eventType'];
  schedule_version: string;
  schedule_version_created_timestamp: string;
  schedule_updated_by: string;
  activity_or_flow_id: string;
  activity_or_flow_name: string;
  item_hidden: string;
  schedule_start_date: string | null;
  schedule_end_date: string | null;
  schedule_date: string;
  schedule_start_time: string;
  schedule_end_time: string;
  access_before_schedule_start_time: string;
  mobile_device_schedule_version: string | null;
  mobile_device_schedule_start_date: string | null;
  mobile_device_schedule_end_date: string | null;
  mobile_device_schedule_start_time: string | null;
  mobile_device_schedule_end_time: string | null;
  mobile_device_schedule_access_before_start_time: string | null;
  mobile_device_schedule_download_timestamp: string | null;
  mobile_device_schedule_utc_timezone_offset: string | null;
};

type FullAccountParticipant = Omit<ParticipantWithDataAccess, 'id'> & { id: string };

type ScheduleHistoryExportOptions = DataExporterOptions & {
  subjectIds?: string;
  respondentIds?: string;
};

/**
 * A helper class to export enumerated schedule history data for a single applet to a CSV file. Enumerated history
 * means that for each day between two given dates (inclusive), we use the periodicity of each event version of each
 * schedule (both default and individual) to determine which schedules were applicable for each user in the applet on that day.
 */
export class ScheduleHistoryExporter extends DataExporter<
  ScheduleHistoryExportRow,
  ScheduleHistoryExportOptions
> {
  constructor(public ownerId: string) {
    super('schedule_history');
  }

  async exportData(params: ScheduleHistoryExportOptions): Promise<void> {
    const rows = await this.generateExportData(params);

    await this.downloadAsCSV(rows);
  }

  async getScheduleHistoryData(
    appletId: string,
    subjectIds?: string,
    respondentIds?: string,
  ): Promise<ScheduleHistoryData[]> {
    return this.requestAllPagesConcurrently(
      (page) => getScheduleHistory({ appletId, subjectIds, respondentIds, page }),
      5,
    );
  }

  async getDeviceScheduleHistoryData(
    appletId: string,
    respondentIds?: string,
  ): Promise<DeviceScheduleHistoryData[]> {
    return this.requestAllPagesConcurrently(
      (page) => getDeviceScheduleHistory({ appletId, respondentIds, page }),
      5,
    );
  }

  async getRespondentData(appletId: string): Promise<ParticipantWithDataAccess[]> {
    return this.requestAllPagesConcurrently(
      (page) => getWorkspaceRespondentsApi({ params: { ownerId: this.ownerId, appletId, page } }),
      5,
    );
  }

  async generateExportData({
    appletId,
    subjectIds,
    ...params
  }: ScheduleHistoryExportOptions): Promise<ScheduleHistoryExportRow[]> {
    const unsortedScheduleHistoryData = await this.getScheduleHistoryData(
      appletId,
      subjectIds,
      params.respondentIds,
    );

    if (unsortedScheduleHistoryData.length === 0) {
      // Nothing to export
      return [];
    }

    const unsortedDeviceScheduleHistoryData = await this.getDeviceScheduleHistoryData(
      appletId,
      params.respondentIds,
    );

    const respondents = await this.getRespondentData(appletId);

    const fullAccountParticipants = respondents.filter(
      (it): it is FullAccountParticipant => !!it.id,
    );

    const sortedScheduleHistoryData = unsortedScheduleHistoryData.sort((a, b) => {
      const aEventVersionCreatedAt = new Date(a.eventVersionCreatedAt);
      const bEventVersionCreatedAt = new Date(b.eventVersionCreatedAt);
      const aLinkedWithAppletAt = new Date(a.linkedWithAppletAt);
      const bLinkedWithAppletAt = new Date(b.linkedWithAppletAt);

      if (aEventVersionCreatedAt.getTime() !== bEventVersionCreatedAt.getTime()) {
        return aEventVersionCreatedAt.getTime() - bEventVersionCreatedAt.getTime();
      } else {
        return aLinkedWithAppletAt.getTime() - bLinkedWithAppletAt.getTime();
      }
    });

    const sortedDeviceScheduleHistoryData = unsortedDeviceScheduleHistoryData.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const days = this.daysBetweenInterval(
      DateTime.fromISO(params?.fromDate ?? sortedScheduleHistoryData[0].eventVersionCreatedAt),
      DateTime.fromISO(params?.toDate ?? DateTime.now().toISO()),
    );

    const rows: ScheduleHistoryExportRow[] = [];

    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      for (const participant of fullAccountParticipants) {
        const schedulesForDay = this.findSchedulesForDay(
          day,
          participant.id,
          sortedScheduleHistoryData,
        );

        schedulesForDay.forEach((schedule) => {
          const deviceSchedule = this.findLatestMobileSchedule(
            day,
            participant.id,
            schedule,
            sortedDeviceScheduleHistoryData,
          );

          let mobileDeviceScheduleAccessBeforeStartTime = null;

          if (
            deviceSchedule?.accessBeforeSchedule !== null &&
            deviceSchedule?.accessBeforeSchedule !== undefined
          ) {
            mobileDeviceScheduleAccessBeforeStartTime = deviceSchedule.accessBeforeSchedule
              ? 'yes'
              : 'no';
          }

          rows.push({
            applet_id: appletId,
            applet_version: schedule.appletVersion,
            user_id: participant.id,

            // This is safe because the participant always has a detail for the applet
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            target_or_source_id: participant.details.find((detail) => detail.appletId === appletId)!
              .subjectId,

            schedule_id: schedule.eventId,
            schedule_type: schedule.eventType,
            schedule_version: schedule.eventVersion,
            schedule_version_created_timestamp: schedule.eventVersionCreatedAt,
            schedule_updated_by: schedule.eventUpdatedBy,
            activity_or_flow_id: schedule.activityOrFlowId,
            activity_or_flow_name: schedule.activityOrFlowName,
            item_hidden: schedule.activityOrFlowHidden ? 'yes' : 'no',
            schedule_start_date: schedule.startDate,
            schedule_end_date: schedule.endDate,
            schedule_date: day,
            schedule_start_time: schedule.startTime,
            schedule_end_time: schedule.endTime,
            access_before_schedule_start_time: schedule.accessBeforeSchedule ? 'yes' : 'no',
            mobile_device_schedule_version: deviceSchedule?.eventVersion ?? null,
            mobile_device_schedule_start_date: deviceSchedule?.startDate ?? null,
            mobile_device_schedule_end_date: deviceSchedule?.endDate ?? null,
            mobile_device_schedule_start_time: deviceSchedule?.startTime ?? null,
            mobile_device_schedule_end_time: deviceSchedule?.endTime ?? null,
            mobile_device_schedule_access_before_start_time:
              mobileDeviceScheduleAccessBeforeStartTime,
            mobile_device_schedule_download_timestamp: deviceSchedule?.createdAt ?? null,
            mobile_device_schedule_utc_timezone_offset: deviceSchedule?.userTimeZone
              ? `${IANAZone.create(deviceSchedule.userTimeZone).offset(
                  DateTime.fromISO(`${deviceSchedule.createdAt}Z`).toMillis(),
                )}`
              : null,
          });
        });
      }
    }

    return rows;
  }

  /**
   * Find which scheduled events were applicable for a given day for a particular user. Multiple schedule events
   * can apply in a number of scenarios, including:
   *
   * - An event was updated during the day in question
   * - There are multiple events for a single activity or flow
   * - There are multiple activities or flows
   */
  public findSchedulesForDay(
    day: string,
    userId: string,
    scheduleHistoryData: ScheduleHistoryData[],
  ): ScheduleHistoryData[] {
    // The `day` variable is an ISO string of the form 'YYYY-MM-DD', which becomes the start of the day (00:00:00)
    // when parsed by Luxon
    const startOfTheDay = DateTime.fromISO(day);
    const endOfTheDay = startOfTheDay.endOf('day');

    // Removes events that couldn't apply to the user
    const filteredByUser = scheduleHistoryData.filter(
      (schedule) => schedule.userId === userId || schedule.userId === null,
    );

    const applicableSchedules: ScheduleHistoryData[] = [];

    const appletVersionLinkDates = Object.entries(
      filteredByUser.reduce<Record<string, DateTime<true>>>((result, schedule) => {
        if (!result[schedule.appletVersion]) {
          result[schedule.appletVersion] = DateTime.fromISO(
            schedule.linkedWithAppletAt,
          ) as DateTime<true>;
        } else {
          const existingDate = result[schedule.appletVersion];
          const newDate = DateTime.fromISO(schedule.linkedWithAppletAt) as DateTime<true>;
          if (newDate < existingDate) {
            result[schedule.appletVersion] = newDate;
          }
        }

        return result;
      }, {}),
    );

    Object.entries(groupBy(filteredByUser, 'appletVersion'))
      .reverse()
      .forEach(([appletVersion, appletVersionGroupedSchedules]) => {
        const indexOfAppletVersion = appletVersionLinkDates.findIndex(
          ([version]) => version === appletVersion,
        );

        const hasNextAppletVersion = indexOfAppletVersion < appletVersionLinkDates.length - 1;

        Object.entries(groupBy(appletVersionGroupedSchedules, 'activityOrFlowId')).forEach(
          ([_, entityGroupedSchedules]) => {
            // Default schedules only survive if there are no individual ones, or if the individual ones have all been deleted
            // before the end time of the default schedule on this day
            const filterDefaultSchedules = entityGroupedSchedules.filter((schedule) => {
              if (schedule.userId !== null) {
                // Keep individual schedule events
                return true;
              }

              const extendsPastDay =
                DateTime.fromISO(schedule.endTime) < DateTime.fromISO(schedule.startTime);

              const endTimeOnDay = extendsPastDay
                ? DateTime.fromISO(`${day}T${schedule.endTime}`).plus({ days: 1 })
                : DateTime.fromISO(`${day}T${schedule.endTime}`);

              return (
                appletVersionGroupedSchedules.filter((competition) => {
                  const isIndividualSchedule = competition.userId !== null;

                  const createdTodayOrBefore =
                    DateTime.fromISO(competition.eventVersionCreatedAt) <= endOfTheDay;

                  const deletionDate = DateTime.fromISO(
                    competition.eventVersionIsDeleted ? competition.eventVersionUpdatedAt : '',
                  );

                  const notDeleted = !deletionDate.isValid;

                  const deletedAfterDefaultScheduleEndTime =
                    deletionDate.isValid && deletionDate > endTimeOnDay;

                  return (
                    isIndividualSchedule &&
                    createdTodayOrBefore &&
                    (notDeleted || deletedAfterDefaultScheduleEndTime)
                  );
                }).length === 0
              );
            });

            // This removes events that don't apply based strictly on periodicity
            // It will contain duplicates
            const filteredByPeriodicity = filterDefaultSchedules.filter((schedule) =>
              this.isSchedulePotentiallyApplicableForDayBasedOnPeriodicity(day, schedule),
            );

            const filteredByEventVersion: ScheduleHistoryData[] = [];

            for (let i = 0; i < filteredByPeriodicity.length; i++) {
              const schedule = filteredByPeriodicity[i];
              const schedulesAhead = filterDefaultSchedules.slice(
                filterDefaultSchedules.indexOf(schedule) + 1,
              );
              const startTimeOnDay = schedule.accessBeforeSchedule
                ? startOfTheDay
                : DateTime.fromISO(`${day}T${schedule.startTime}`);

              let isSupersededOnThisDate = false;
              for (let j = 0; j < schedulesAhead.length; j++) {
                const scheduleAhead = schedulesAhead[j];
                const scheduleAheadCreationDate = DateTime.fromISO(
                  scheduleAhead.eventVersionCreatedAt,
                );

                const isSameScheduleType = scheduleAhead.userId === schedule.userId;
                const isSameEntity = scheduleAhead.activityOrFlowId === schedule.activityOrFlowId;
                const isCreatedBeforeStartTime = scheduleAheadCreationDate <= startTimeOnDay;
                const isSameEvent = scheduleAhead.eventId === schedule.eventId;
                const isOneAlwaysAvailable =
                  schedule.periodicity === 'ALWAYS' || scheduleAhead.periodicity === 'ALWAYS';

                if (
                  isSameScheduleType &&
                  isSameEntity &&
                  isCreatedBeforeStartTime &&
                  (isSameEvent || isOneAlwaysAvailable)
                ) {
                  isSupersededOnThisDate = true;
                  break;
                }
              }

              if (!isSupersededOnThisDate) {
                filteredByEventVersion.push(schedule);
              }
            }

            const filteredByDeletion = filteredByEventVersion.filter((schedule) => {
              const startTimeOnDay = schedule.accessBeforeSchedule
                ? startOfTheDay
                : DateTime.fromISO(`${day}T${schedule.startTime}`);

              const deletionDate = DateTime.fromISO(
                schedule.eventVersionIsDeleted ? schedule.eventVersionUpdatedAt : '',
              );

              return !deletionDate.isValid || deletionDate >= startTimeOnDay;
            });

            const filteredByAppletVersion = filteredByDeletion.filter((schedule) => {
              const scheduleLinkDate = DateTime.fromISO(schedule.linkedWithAppletAt);
              const extendsPastDay =
                DateTime.fromISO(schedule.endTime) < DateTime.fromISO(schedule.startTime);

              const endTimeOnDay = extendsPastDay
                ? DateTime.fromISO(`${day}T${schedule.endTime}`).plus({ days: 1 })
                : DateTime.fromISO(`${day}T${schedule.endTime}`);

              if (scheduleLinkDate > endTimeOnDay) {
                return false;
              }
              if (hasNextAppletVersion) {
                const [_, appletVersionLinkDate] = appletVersionLinkDates[indexOfAppletVersion + 1];

                const startTimeOnDay = schedule.accessBeforeSchedule
                  ? startOfTheDay
                  : DateTime.fromISO(`${day}T${schedule.startTime}`);

                // If the creationDate of the next applet version comes before this event, skip it
                return appletVersionLinkDate > startTimeOnDay;
              } else {
                return true;
              }
            });

            applicableSchedules.push(...filteredByAppletVersion);
          },
        );
      });

    return applicableSchedules.sort((a, b) => {
      const startTimeDiff =
        DateTime.fromISO(`${day}T${a.startTime}`).valueOf() -
        DateTime.fromISO(`${day}T${b.startTime}`).valueOf();

      if (startTimeDiff !== 0) {
        return startTimeDiff;
      } else {
        return (
          DateTime.fromISO(`${day}T${a.endTime}`).valueOf() -
          DateTime.fromISO(`${day}T${b.endTime}`).valueOf()
        );
      }
    });
  }

  private isSchedulePotentiallyApplicableForDayBasedOnPeriodicity(
    day: string,
    schedule: ScheduleHistoryData,
  ): boolean {
    const startOfTheDay = DateTime.fromISO(day);
    const creationDay = DateTime.fromISO(schedule.eventVersionCreatedAt).startOf('day');

    // The next version of this event displaces its applicability only when
    // it is created before this event's time period on the day in question
    // const nextVersionOverrides = nextVersionCreatedDate.isValid && nextVersionCreatedDate < targetDate;

    switch (schedule.periodicity) {
      case 'ALWAYS': {
        return creationDay <= startOfTheDay;
      }
      case 'ONCE': {
        // This schedule applies only on the day it is scheduled for
        // as long as there isn't a newer version
        return schedule.selectedDate === day;
      }
      case 'DAILY': {
        // Daily schedules don't have a selected date
        if (schedule.startDate === null || schedule.endDate === null) {
          return false;
        }

        const interval = Interval.fromISO(`${schedule.startDate}/${schedule.endDate}`);

        return (
          creationDay <= startOfTheDay &&
          interval.isValid &&
          // This schedule applies every day, between the indicated start and end dates
          // Intervals are not inclusive of the end date, so we need to explicitly check if the target date is the
          // same as the end date
          (interval.contains(startOfTheDay) || interval.end.hasSame(startOfTheDay, 'day'))
        );
      }
      case 'WEEKLY': {
        if (
          schedule.startDate === null ||
          schedule.endDate === null ||
          schedule.selectedDate === null
        ) {
          return false;
        }

        const interval = Interval.fromISO(`${schedule.startDate}/${schedule.endDate}`);

        const isDateInInterval =
          interval.isValid &&
          (interval.contains(startOfTheDay) || interval.end.hasSame(startOfTheDay, 'day'));
        const isCorrectDayOfWeek =
          startOfTheDay.weekday === DateTime.fromISO(schedule.selectedDate).weekday;

        // This schedule applies every week on the selected date, between the indicated start and end dates
        // Check if the date in question falls inside a weekly recurrence of the selected date
        return creationDay <= startOfTheDay && isDateInInterval && isCorrectDayOfWeek;
      }
      case 'WEEKDAYS': {
        if (schedule.startDate === null || schedule.endDate === null) {
          return false;
        }

        const interval = Interval.fromISO(`${schedule.startDate}/${schedule.endDate}`);

        const isDateInInterval =
          interval.isValid &&
          (interval.contains(startOfTheDay) || interval.end.hasSame(startOfTheDay, 'day'));

        // Using !date.isWeekend here is not sufficient because some locales consider Sunday a weekday
        const isDateWeekday = startOfTheDay.weekday !== 6 && startOfTheDay.weekday !== 7;

        // This schedule applies every weekday between the indicated start and end dates (inclusive)
        return creationDay <= startOfTheDay && isDateInInterval && isDateWeekday;
      }
      case 'MONTHLY': {
        if (
          schedule.startDate === null ||
          schedule.endDate === null ||
          schedule.selectedDate === null
        ) {
          return false;
        }

        const interval = Interval.fromISO(`${schedule.startDate}/${schedule.endDate}`);

        const isDateInInterval =
          interval.isValid &&
          (interval.contains(startOfTheDay) || interval.end.hasSame(startOfTheDay, 'day'));

        const selectedDate = DateTime.fromISO(schedule.selectedDate);

        // Check if the date in question falls inside a monthly recurrence of the selected date
        // Handling edge cases where the selected date is greater than the last day of the month
        const isCorrectDayOfMonth =
          selectedDate.day === startOfTheDay.day ||
          (startOfTheDay.day === startOfTheDay.daysInMonth && selectedDate.day > startOfTheDay.day);

        // This schedule applies every month on the selected date, between the indicated start and end dates
        return creationDay <= startOfTheDay && isDateInInterval && isCorrectDayOfMonth;
      }
    }

    return false;
  }

  /**
   * Find the latest schedule among a user's devices for the day in question. If the user has more than one applicable
   * device on this day, the latest one will be returned.
   */
  private findLatestMobileSchedule(
    day: string,
    userId: string,
    scheduleHistoryEvent: ScheduleHistoryData,
    sortedDeviceScheduleHistoryData: DeviceScheduleHistoryData[],
  ): DeviceScheduleHistoryData | null {
    // We just need to find the versions of this schedule that the user has downloaded
    // that aren't newer than the event version we're looking at
    // and was downloaded before its start time

    const localStartTimeOnDay = DateTime.fromISO(`${day}T${scheduleHistoryEvent.startTime}`);

    const schedulesFound = sortedDeviceScheduleHistoryData.filter((schedule) => {
      if (!schedule.userTimeZone) {
        return false;
      }

      const userTimeZone = IANAZone.create(schedule.userTimeZone);

      if (!userTimeZone.isValid) {
        return false;
      }

      const [deviceDatePart, deviceNumberPart] = schedule.eventVersion.split('-');
      const [eventDatePart, eventNumberPart] = scheduleHistoryEvent.eventVersion.split('-');
      const utcDownloadTimestamp = DateTime.fromISO(`${schedule.createdAt}Z`);
      const offset = userTimeZone.offset(utcDownloadTimestamp.toMillis());
      const localDownloadTimestamp = utcDownloadTimestamp.plus({ minutes: offset });

      return (
        schedule.userId === userId &&
        schedule.eventId === scheduleHistoryEvent.eventId &&
        DateTime.fromFormat(deviceDatePart, 'yyyyMMdd') <=
          DateTime.fromFormat(eventDatePart, 'yyyyMMdd') &&
        parseInt(deviceNumberPart) <= parseInt(eventNumberPart) &&
        localDownloadTimestamp < localStartTimeOnDay
      );
    });

    // Since the list is already sorted by the creation date, we get the latest one by
    // taking the last one in the list.
    return schedulesFound.at(-1) ?? null;
  }

  getCSVHeaders(): string[] {
    return [
      'applet_id',
      'applet_version',
      'user_id',
      'target_or_source_id',
      'schedule_id',
      'schedule_type',
      'schedule_version',
      'schedule_version_created_timestamp',
      'schedule_updated_by',
      'activity_or_flow_id',
      'activity_or_flow_name',
      'item_hidden',
      'schedule_start_date',
      'schedule_end_date',
      'schedule_date',
      'schedule_start_time',
      'schedule_end_time',
      'access_before_schedule_start_time',
      'mobile_device_schedule_version',
      'mobile_device_schedule_start_date',
      'mobile_device_schedule_end_date',
      'mobile_device_schedule_start_time',
      'mobile_device_schedule_end_time',
      'mobile_device_schedule_access_before_start_time',
      'mobile_device_schedule_download_timestamp',
      'mobile_device_schedule_utc_timezone_offset',
    ];
  }
}
