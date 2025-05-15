import { DateTime, IANAZone, Interval } from 'luxon';
import { AxiosResponse } from 'axios';

import {
  DeviceScheduleHistoryData,
  getDeviceScheduleHistory,
  getScheduleHistory,
  ScheduleHistoryData,
} from 'modules/Dashboard/api';
import { apiDashboardSlice } from 'modules/Dashboard/api/apiSlice';
import { ParticipantWithDataAccess } from 'modules/Dashboard/types';
import { DataExporter, DataExporterOptions } from 'shared/utils/exportData/exporters/DataExporter';
import { groupBy } from 'shared/utils/array';
import { Response } from 'shared/api';
import { store } from 'redux/store';
import { DEFAULT_API_RESULTS_PER_PAGE } from 'modules/Dashboard/api/api.const';

export type ScheduleHistoryExportRow = {
  applet_id: string;
  applet_version: string;
  user_id: string;
  target_or_source_id: string;
  schedule_id: string;
  schedule_type: ScheduleHistoryData['eventType'];
  schedule_version: string;
  schedule_version_created_timestamp: string;
  schedule_applet_link_timestamp: string;
  schedule_updated_by: string;
  activity_or_flow_id: string;
  activity_or_flow_name: string;
  activity_or_flow_hidden: string;
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
  /**
   * Restrict the export file to those users with the given subject IDs. If provided together with `respondentIds`,
   * the result will be the intersection of the two
   */
  subjectIds?: string[];

  /**
   * Restrict the export file to those users with these IDs. If provided together with `subjectIds`,
   * the result will be the intersection of the two
   */
  respondentIds?: string[];

  /**
   * The list of activities and/or flows for which to export schedule history
   */
  activityOrFlowIds?: string[];
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

    if (rows.length === 0) {
      // Nothing to export
      return;
    }

    await this.downloadAsCSV(rows);
  }

  /**
   * Fetch all the schedule history data from the API
   * @param appletId The applet for which to fetch the schedule history data
   * @param subjectIds Optionally filter the schedule history by user subject ID
   * @param respondentIds Optionally filter the schedule history by user ID
   * @param activityOrFlowIds Optionally filter the schedule history by activity and flow IDs
   */
  async getScheduleHistoryData(
    appletId: string,
    subjectIds?: string[],
    respondentIds?: string[],
    activityOrFlowIds?: string[],
  ): Promise<ScheduleHistoryData[]> {
    return this.requestAllPagesConcurrently(
      (page) =>
        getScheduleHistory({ appletId, subjectIds, respondentIds, activityOrFlowIds, page }),
      5,
    );
  }

  /**
   * Fetch all the device schedule history records for this applet, optionally filtered by a list of user IDs
   */
  async getDeviceScheduleHistoryData(
    appletId: string,
    respondentIds?: string[],
  ): Promise<DeviceScheduleHistoryData[]> {
    return this.requestAllPagesConcurrently(
      (page) => getDeviceScheduleHistory({ appletId, respondentIds, page }),
      5,
    );
  }

  /**
   * Get a list of all the respondents in the applet. This list is used to enumerate all the rows in the CSV file
   * @param appletId
   */
  async getRespondentData(appletId: string): Promise<ParticipantWithDataAccess[]> {
    return this.requestAllPagesConcurrently(async (page) => {
      const data = await store
        .dispatch(
          apiDashboardSlice.endpoints.getWorkspaceRespondents.initiate({
            params: {
              ownerId: this.ownerId,
              includeSoftDeletedSubjects: true,
              appletId,
              page,
              limit: DEFAULT_API_RESULTS_PER_PAGE,
            },
          }),
        )
        .unwrap();

      return { data } as AxiosResponse<Response<ParticipantWithDataAccess>>;
    }, 5);
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
      params.activityOrFlowIds,
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

    const fullAccountParticipants = respondents
      .filter((it): it is FullAccountParticipant => !!it.id)
      .filter((it) => {
        if (!subjectIds) {
          return true;
        }

        const detail = it.details.find((detail) => detail.appletId === appletId);
        if (!detail) {
          return false;
        }

        return subjectIds.includes(detail.subjectId);
      })
      .filter((it) => {
        if (!params.respondentIds) {
          return true;
        }

        return params.respondentIds.includes(it.id);
      });

    if (fullAccountParticipants.length === 0) {
      // Nothing to export
      return [];
    }

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

    const fromDate = DateTime.fromISO(
      params?.fromDate ?? sortedScheduleHistoryData[0].eventVersionCreatedAt,
      { zone: 'UTC' },
    ).toFormat('yyyy-MM-dd');

    const toDateTime = params?.toDate
      ? DateTime.fromISO(params.toDate, { zone: 'UTC' })
      : DateTime.now().toUTC();

    const toDate = toDateTime.toFormat('yyyy-MM-dd');

    const days = this.daysBetweenInterval(fromDate, toDate);

    const rows: ScheduleHistoryExportRow[] = [];

    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      const utcStartOfDay = DateTime.fromISO(`${day}T00:00:00`, { zone: 'UTC' });
      const utcEndOfDay = utcStartOfDay.endOf('day');
      for (const participant of fullAccountParticipants) {
        const participantDetail = participant.details.find(
          (detail) => detail.appletId === appletId,
        );

        if (participantDetail) {
          const invitation = participantDetail.invitation;
          if (invitation && invitation.acceptedAt) {
            const invitationAcceptedAt = DateTime.fromISO(invitation.acceptedAt, { zone: 'UTC' });
            if (invitationAcceptedAt > utcEndOfDay) {
              // This user hasn't been added to the applet yet at this point in history,
              // so let's skip them for now
              continue;
            }
          }

          if (participantDetail.subjectIsDeleted) {
            const deletionDate = DateTime.fromISO(participantDetail.subjectUpdatedAt, {
              zone: 'UTC',
            });
            if (deletionDate < utcStartOfDay) {
              // This participant has been removed from the applet at this point, so let's skip them
              continue;
            }
          }
        }

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
            schedule_applet_link_timestamp: schedule.linkedWithAppletAt,
            schedule_updated_by: schedule.eventUpdatedBy,
            activity_or_flow_id: schedule.activityOrFlowId,
            activity_or_flow_name: schedule.activityOrFlowName,
            activity_or_flow_hidden: schedule.activityOrFlowHidden ? 'yes' : 'no',
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
    if (!this.isISODate(day)) {
      return [];
    }

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

    // The `day` parameter is an ISO string of the form 'YYYY-MM-DD', which becomes the start of the day (00:00:00)
    // when parsed by Luxon
    const startOfTheDay = DateTime.fromISO(`${day}`, { zone: 'UTC' });
    const endOfTheDay = startOfTheDay.endOf('day');

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

              return (
                appletVersionGroupedSchedules.filter((competition) => {
                  const isIndividualSchedule = competition.userId !== null;

                  // We add 1 day to the creation time so that the default schedule will still show up
                  // on its actual creation day
                  const offsetScheduleCreationDate = DateTime.fromISO(
                    competition.eventVersionCreatedAt,
                    { zone: 'UTC' },
                  ).plus({ days: 1 });

                  const createdTodayOrBefore = offsetScheduleCreationDate <= endOfTheDay;

                  const deletionDate = DateTime.fromISO(
                    competition.eventVersionIsDeleted ? competition.eventVersionUpdatedAt : '',
                    { zone: 'UTC' },
                  );

                  const notDeleted = !deletionDate.isValid;

                  // If the individual schedule was deleted at any point today, the default schedule starts applying
                  // again
                  const deletedAfterToday = deletionDate.isValid && deletionDate > endOfTheDay;

                  const supersededBeforeToday = appletVersionGroupedSchedules.some(
                    (nextScheduleVersion) =>
                      competition.eventId === nextScheduleVersion.eventId &&
                      competition.eventVersion !== nextScheduleVersion.eventVersion &&
                      DateTime.fromISO(nextScheduleVersion.eventVersionCreatedAt, {
                        zone: 'UTC',
                      }) <= startOfTheDay &&
                      DateTime.fromISO(nextScheduleVersion.eventVersionCreatedAt) >
                        DateTime.fromISO(competition.eventVersionCreatedAt),
                  );

                  return (
                    isIndividualSchedule &&
                    createdTodayOrBefore &&
                    (notDeleted || deletedAfterToday) &&
                    !supersededBeforeToday
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

              let isSupersededOnThisDate = false;
              for (let j = 0; j < schedulesAhead.length; j++) {
                const scheduleAhead = schedulesAhead[j];

                // We add 1 day to the creation time so that the previous schedule version will still show up
                // on its actual creation day
                const offsetScheduleAheadCreationDate = DateTime.fromISO(
                  scheduleAhead.eventVersionCreatedAt,
                  { zone: 'UTC' },
                ).plus({ days: 1 });

                const isSameScheduleType = scheduleAhead.userId === schedule.userId;
                const isSameEntity = scheduleAhead.activityOrFlowId === schedule.activityOrFlowId;
                const isCreatedTodayOrBefore = offsetScheduleAheadCreationDate <= endOfTheDay;
                const isSameEvent = scheduleAhead.eventId === schedule.eventId;
                const isOneAlwaysAvailable =
                  schedule.periodicity === 'ALWAYS' || scheduleAhead.periodicity === 'ALWAYS';

                if (
                  isSameScheduleType &&
                  isSameEntity &&
                  isCreatedTodayOrBefore &&
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

            // An event is valid up to and including the day it is deleted
            const filteredByDeletion = filteredByEventVersion.filter((schedule) => {
              const deletionDate = DateTime.fromISO(
                schedule.eventVersionIsDeleted ? schedule.eventVersionUpdatedAt : '',
                { zone: 'UTC' },
              );

              const isDeleted = deletionDate.isValid;

              return !isDeleted || deletionDate >= startOfTheDay;
            });

            const filteredByAppletVersion = filteredByDeletion.filter((schedule) => {
              // Keep newer applet versions from appearing in the export file for days before they are applicable
              // This is relevant in cases where a newer applet version has been linked to an older event
              const scheduleLinkDate = DateTime.fromISO(schedule.linkedWithAppletAt);
              if (scheduleLinkDate > endOfTheDay) {
                return false;
              }

              if (hasNextAppletVersion) {
                const [_, appletVersionLinkDate] = appletVersionLinkDates[indexOfAppletVersion + 1];

                // Offset by 1 day to keep the older applet version showing up on the day the new version
                // is linked
                const offsetAppletVersionLinkDate = appletVersionLinkDate.plus({ days: 1 });

                // Keep older applet versions from appearing in the export file for days after a new applet version
                // is linked
                return offsetAppletVersionLinkDate > endOfTheDay;
              }

              return true;
            });

            applicableSchedules.push(...filteredByAppletVersion);
          },
        );
      });

    const withResolvedScheduleAndAppletVersionLinking: ScheduleHistoryData[] = [];

    /**
     * When multiple schedules (default and individual) are linked to multiple applet versions on the same day,
     * the default schedule should not show up for applet versions after the individual schedule is linked
     */
    Object.entries(groupBy(applicableSchedules, 'activityOrFlowId')).forEach(
      ([_, entityGroupedSchedules]) => {
        const typesOfSchedulesLinkedToday: Set<'default' | 'individual'> = new Set();
        const appletVersionsLinkedToday: Set<string> = new Set();
        const schedulesLinkedToday = entityGroupedSchedules.filter((schedule) => {
          const scheduleLinkDate = DateTime.fromISO(schedule.linkedWithAppletAt, {
            zone: 'UTC',
          });

          const linkedToday = scheduleLinkDate >= startOfTheDay && scheduleLinkDate <= endOfTheDay;

          if (linkedToday) {
            const type = !schedule.userId ? 'default' : 'individual';
            typesOfSchedulesLinkedToday.add(type);
            appletVersionsLinkedToday.add(schedule.appletVersion);
          }

          return linkedToday;
        });

        let resolvedSchedules = entityGroupedSchedules;
        if (typesOfSchedulesLinkedToday.size > 1 && appletVersionsLinkedToday.size > 1) {
          const sortedByLinkDate = [...schedulesLinkedToday].sort((a, b) => {
            const aLinkDate = DateTime.fromISO(a.linkedWithAppletAt, { zone: 'UTC' });
            const bLinkDate = DateTime.fromISO(b.linkedWithAppletAt, { zone: 'UTC' });

            return aLinkDate.valueOf() - bLinkDate.valueOf();
          });

          const indexOfFirstIndividualScheduleLinkedToday = sortedByLinkDate.findIndex(
            (schedule) => !!schedule.userId,
          );
          let indexOfLastIndividualScheduleLinkedToday = -1;
          let indexOfLastDefaultScheduleLinkedTodayBeforeIndividual = -1;

          for (let i = sortedByLinkDate.length - 1; i >= 0; i--) {
            const schedule = sortedByLinkDate[i];
            if (schedule.userId && indexOfLastIndividualScheduleLinkedToday === -1) {
              indexOfLastIndividualScheduleLinkedToday = i;
            } else if (!schedule.userId && indexOfLastIndividualScheduleLinkedToday !== -1) {
              indexOfLastDefaultScheduleLinkedTodayBeforeIndividual = i;
              break;
            }
          }

          const lastIndividualScheduleLinkedToday =
            sortedByLinkDate[indexOfLastIndividualScheduleLinkedToday];

          const lastIndividualScheduleLinkedTodayIsDeletedToday =
            lastIndividualScheduleLinkedToday.eventVersionIsDeleted &&
            DateTime.fromISO(lastIndividualScheduleLinkedToday.eventVersionUpdatedAt, {
              zone: 'UTC',
            }) <= endOfTheDay;

          resolvedSchedules = entityGroupedSchedules.filter((schedule) => {
            // Check for schedules linked to their applet versions today. If there are both default and individual,
            // and multiple applet versions, we need to make sure the default ones linked after the individual
            // don't show up, unless the individual is deleted
            if (!schedulesLinkedToday.includes(schedule)) {
              return true;
            }

            if (schedule.userId) {
              return true;
            }

            const linkedTodayIndex = sortedByLinkDate.indexOf(schedule);

            return (
              (lastIndividualScheduleLinkedTodayIsDeletedToday &&
                linkedTodayIndex === indexOfLastDefaultScheduleLinkedTodayBeforeIndividual) ||
              linkedTodayIndex > indexOfLastIndividualScheduleLinkedToday ||
              linkedTodayIndex < indexOfFirstIndividualScheduleLinkedToday
            );
          });
        }

        if (resolvedSchedules.length > 0) {
          withResolvedScheduleAndAppletVersionLinking.push(...resolvedSchedules);
        }
      },
    );

    return withResolvedScheduleAndAppletVersionLinking.sort((a, b) => {
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
  findLatestMobileSchedule(
    day: string,
    userId: string,
    scheduleHistoryEvent: ScheduleHistoryData,
    sortedDeviceScheduleHistoryData: DeviceScheduleHistoryData[],
  ): DeviceScheduleHistoryData | null {
    // We just need to find the versions of this schedule that the user has downloaded
    // that aren't newer than the event version we're looking at
    // and was downloaded before its end time

    const schedulesFound = sortedDeviceScheduleHistoryData.filter((schedule) => {
      if (!schedule.userTimeZone) {
        return false;
      }

      const userTimeZone = IANAZone.create(schedule.userTimeZone);

      if (!userTimeZone.isValid) {
        return false;
      }

      let localEndTimeOnDay = DateTime.fromISO(`${day}T${scheduleHistoryEvent.endTime}`, {
        zone: userTimeZone,
      });

      const extendsPastDay =
        DateTime.fromISO(schedule.endTime) < DateTime.fromISO(schedule.startTime);

      if (extendsPastDay) {
        localEndTimeOnDay = localEndTimeOnDay.plus({ days: 1 });
      }

      const [deviceDatePart, deviceNumberPart] = schedule.eventVersion.split('-');
      const [eventDatePart, eventNumberPart] = scheduleHistoryEvent.eventVersion.split('-');
      const downloadTimestamp = DateTime.fromISO(`${schedule.createdAt}Z`);

      const sameDay = deviceDatePart === eventDatePart;

      const deviceVersionOlderOrSameAsEventVersion =
        DateTime.fromFormat(deviceDatePart, 'yyyyMMdd') <
          DateTime.fromFormat(eventDatePart, 'yyyyMMdd') ||
        (sameDay && parseInt(deviceNumberPart) <= parseInt(eventNumberPart));

      return (
        schedule.userId === userId &&
        schedule.eventId === scheduleHistoryEvent.eventId &&
        deviceVersionOlderOrSameAsEventVersion &&
        downloadTimestamp < localEndTimeOnDay
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
      'schedule_applet_link_timestamp',
      'schedule_updated_by',
      'activity_or_flow_id',
      'activity_or_flow_name',
      'activity_or_flow_hidden',
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
