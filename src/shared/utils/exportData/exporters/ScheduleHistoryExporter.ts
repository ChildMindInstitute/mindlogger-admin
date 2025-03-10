import { DateTime, Interval } from 'luxon';

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

type ScheduleHistoryExportRow = {
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
  schedule_start_date: string | null;
  schedule_end_date: string | null;
  schedule_date: string;
  schedule_start_time: string;
  schedule_end_time: string;
  mobile_device_schedule_version: string | null;
  mobile_device_schedule_start_date: string | null;
  mobile_device_schedule_end_date: string | null;
  mobile_device_schedule_start_time: string | null;
  mobile_device_schedule_end_time: string | null;
  mobile_device_schedule_download_timestamp: string | null;
};

type FullAccountParticipant = Omit<ParticipantWithDataAccess, 'id'> & { id: string };

type ScheduleHistoryExportOptions = DataExporterOptions & {
  subjectIds?: string;
  respondentIds?: string;
};

export class ScheduleHistoryExporter extends DataExporter<
  ScheduleHistoryExportRow,
  ScheduleHistoryExportOptions
> {
  constructor(public ownerId: string) {
    super('schedule_history');
  }

  async exportData({
    appletId,
    subjectIds,
    ...params
  }: ScheduleHistoryExportOptions): Promise<void> {
    const rows: ScheduleHistoryExportRow[] = [];

    const unsortedScheduleHistoryData = await this.requestAllPagesConcurrently(
      (page) => getScheduleHistory({ appletId, subjectIds, ...params, page }),
      5,
    );

    if (unsortedScheduleHistoryData.length === 0) {
      // Nothing to export
      return;
    }

    const unsortedDeviceScheduleHistoryData = await this.requestAllPagesConcurrently(
      (page) => getDeviceScheduleHistory({ appletId, ...params, page }),
      5,
    );

    const respondents = await this.requestAllPagesConcurrently(
      (page) =>
        getWorkspaceRespondentsApi({
          params: { ownerId: this.ownerId, appletId, page },
        }),
      5,
    );

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

    const periodStartDate = new Date(
      params?.fromDate ?? sortedDeviceScheduleHistoryData[0].createdAt,
    );
    // const periodEndDate = new Date(params?.toDate ?? DateTime.now().toISO());
    const periodEndDate = DateTime.fromISO('2025-03-14').toJSDate();

    const days = this.daysBetweenInterval(
      DateTime.fromJSDate(periodStartDate),
      DateTime.fromJSDate(periodEndDate),
    );

    for (const day of days) {
      for (const participant of fullAccountParticipants) {
        // This contains the history of both default and individual schedules
        const schedulesForDay = this.findSchedulesForDay(
          day,
          participant.id,
          sortedScheduleHistoryData,
        );

        schedulesForDay.forEach((schedule) => {
          const deviceSchedule = this.findLatestMobileSchedule(
            participant.id,
            schedule,
            sortedDeviceScheduleHistoryData,
          );

          // TODO: Figure out which schedule applies here, individual vs default
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
            schedule_start_date: schedule.startDate,
            schedule_end_date: schedule.endDate,
            schedule_date: day,
            schedule_start_time: schedule.startTime,
            schedule_end_time: schedule.endTime,
            mobile_device_schedule_version: deviceSchedule?.eventVersion ?? null,
            mobile_device_schedule_start_date: deviceSchedule?.startDate ?? null,
            mobile_device_schedule_end_date: deviceSchedule?.endDate ?? null,
            mobile_device_schedule_start_time: deviceSchedule?.startTime ?? null,
            mobile_device_schedule_end_time: deviceSchedule?.endTime ?? null,
            mobile_device_schedule_download_timestamp: deviceSchedule?.createdAt ?? null,
          });
        });
      }
    }

    await this.downloadAsCSV(rows);
  }

  /**
   * Find which schedule events were applicable for a given day for a particular user. Multiple schedule events
   * can apply if the event was updated during the day.
   */
  public findSchedulesForDay(
    day: string,
    userId: string,
    scheduleHistoryData: ScheduleHistoryData[],
  ): ScheduleHistoryData[] {
    const applicableSchedules: ScheduleHistoryData[] = [];

    Object.entries(groupBy(scheduleHistoryData, 'activityOrFlowId')).forEach(([_, schedules]) => {
      const sortedSchedules = schedules.sort(
        (a, b) =>
          new Date(a.eventVersionCreatedAt).getTime() - new Date(b.eventVersionCreatedAt).getTime(),
      );

      // Removes events that couldn't apply to the user
      const filteredByUser = sortedSchedules.filter(
        (schedule) => schedule.userId === userId || schedule.userId === null,
      );

      // This removes events that don't apply based strictly on periodicity
      // It will contain duplicates
      const filteredByPeriodicity = filteredByUser.filter((schedule) =>
        this.isSchedulePotentiallyApplicableForDayBasedOnPeriodicity(day, schedule),
      );

      const filteredByVersion: ScheduleHistoryData[] = [];
      const date = DateTime.fromISO(day);

      for (let i = 0; i < filteredByPeriodicity.length; i++) {
        const schedule = filteredByPeriodicity[i];
        const schedulesAhead = filteredByPeriodicity.slice(i + 1);

        let isSupersededOnThisDate = false;
        for (let j = 0; j < schedulesAhead.length; j++) {
          const scheduleAhead = schedulesAhead[j];
          const nestedScheduleCreationDate = DateTime.fromISO(scheduleAhead.eventVersionCreatedAt);

          const isSameScheduleType = scheduleAhead.userId === schedule.userId;
          const isSameEntity = scheduleAhead.activityOrFlowId === schedule.activityOrFlowId;
          const isSameEvent = scheduleAhead.eventId === schedule.eventId;
          const isCreatedBeforeDate = nestedScheduleCreationDate.startOf('day') <= date;

          if (
            isSameScheduleType &&
            isSameEntity &&
            isCreatedBeforeDate &&
            (isSameEvent || scheduleAhead.periodicity === 'ALWAYS')
          ) {
            isSupersededOnThisDate = true;
            break;
          }
        }

        if (!isSupersededOnThisDate) {
          filteredByVersion.push(schedule);
        }
      }

      const filteredByDeletion = filteredByVersion.filter((schedule) => {
        const startTimeOnDay = DateTime.fromISO(`${day}T${schedule.startTime}`);

        const deletionDate = DateTime.fromISO(
          schedule.eventVersionIsDeleted ? schedule.eventVersionUpdatedAt : '',
        );

        return !deletionDate.isValid || deletionDate >= startTimeOnDay;
      });

      applicableSchedules.push(...filteredByDeletion);
    });

    return applicableSchedules;
  }

  private isSchedulePotentiallyApplicableForDayBasedOnPeriodicity(
    day: string,
    schedule: ScheduleHistoryData,
  ): boolean {
    const date = DateTime.fromISO(day);

    // The next version of this event displaces its applicability only when
    // it is created before this event's time period on the day in question
    // const nextVersionOverrides = nextVersionCreatedDate.isValid && nextVersionCreatedDate < targetDate;

    switch (schedule.periodicity) {
      case 'ALWAYS': {
        return DateTime.fromISO(schedule.eventVersionCreatedAt).startOf('day') <= date;
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
          interval.isValid &&
          // This schedule applies every day, between the indicated start and end dates
          // Intervals are not inclusive of the end date, so we need to explicitly check if the target date is the
          // same as the end date
          (interval.contains(date) || interval.end.hasSame(date, 'day'))
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

        const startDate = DateTime.fromISO(schedule.startDate);
        const selectedDate = DateTime.fromISO(schedule.selectedDate);

        // This schedule applies every week on the selected date, between the indicated start and end dates
        // Check if the date in question falls inside a weekly recurrence of the selected date
        return startDate <= date && selectedDate <= date && date.weekday === selectedDate.weekday;
      }
      case 'WEEKDAYS': {
        if (schedule.startDate === null || schedule.endDate === null) {
          return false;
        }

        const interval = Interval.fromISO(`${schedule.startDate}/${schedule.endDate}`);

        // This schedule applies every weekday between the indicated start and end dates (inclusive)
        return (
          // Using !targetDate.isWeekend here is not sufficient because some locales consider Sunday a weekday
          date.weekday !== 6 &&
          date.weekday !== 7 &&
          interval.isValid &&
          (interval.contains(date) || interval.end.hasSame(date, 'day'))
        );
      }
      case 'MONTHLY': {
        if (
          schedule.startDate === null ||
          schedule.endDate === null ||
          schedule.selectedDate === null
        ) {
          return false;
        }

        const startDate = DateTime.fromISO(schedule.startDate);
        const selectedDate = DateTime.fromISO(schedule.selectedDate);

        // This schedule applies every month on the selected date, between the indicated start and end dates
        // Check if the date in question falls inside a monthly recurrence of the selected date
        // Handling edge cases where the selected date is the 31st and the target date is the 30th
        return (
          startDate <= date &&
          selectedDate <= date &&
          (selectedDate.day === date.day ||
            (date.day === date.daysInMonth && selectedDate.day > date.day))
        );
      }
    }

    return false;
  }

  /**
   * Find the latest schedule among a user's devices for the day in question. If the user has more than one applicable
   * device on this day, the latest one will be returned.
   */
  private findLatestMobileSchedule(
    userId: string,
    scheduleHistoryEvent: ScheduleHistoryData,
    sortedDeviceScheduleHistoryData: DeviceScheduleHistoryData[],
  ): DeviceScheduleHistoryData | null {
    // We just need to find the versions of this schedule that the user has downloaded
    // that aren't newer than the event version we're looking at
    const schedulesFound = sortedDeviceScheduleHistoryData.filter((schedule) => {
      const [deviceDatePart, deviceNumberPart] = schedule.eventVersion.split('-');
      const [eventDatePart, eventNumberPart] = scheduleHistoryEvent.eventVersion.split('-');

      return (
        schedule.userId === userId &&
        schedule.eventId === scheduleHistoryEvent.eventId &&
        DateTime.fromFormat(deviceDatePart, 'yyyyMMdd') <=
          DateTime.fromFormat(eventDatePart, 'yyyyMMdd') &&
        parseInt(deviceNumberPart) <= parseInt(eventNumberPart)
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
      'schedule_start_date',
      'schedule_end_date',
      'schedule_date',
      'schedule_start_time',
      'schedule_end_time',
      'mobile_device_schedule_version',
      'mobile_device_schedule_start_date',
      'mobile_device_schedule_end_date',
      'mobile_device_schedule_start_time',
      'mobile_device_schedule_end_time',
      'mobile_device_schedule_download_timestamp',
    ];
  }
}
