import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DateTime } from 'luxon';

import { DeviceScheduleHistoryData, Periodicity, ScheduleHistoryData } from 'modules/Dashboard/api';
import { ScheduleHistoryExporter } from 'shared/utils/exportData/exporters/ScheduleHistoryExporter';
import {
  mockedAppletId,
  mockedFullParticipant1DetailWithDataAccess,
  mockedFullParticipant1WithDataAccess,
  mockedOwnerId,
  mockedOwnerParticipantWithDataAccess,
} from 'shared/mock';
import { ParticipantStatus, ParticipantWithDataAccess } from 'modules/Dashboard/types';
import { Roles } from 'shared/consts';

describe('ScheduleHistoryExporter', () => {
  const exporter = new ScheduleHistoryExporter(mockedOwnerId);

  describe('findSchedulesForDays', () => {
    const scheduleData = (
      override: Partial<ScheduleHistoryData> &
        Pick<
          ScheduleHistoryData,
          | 'eventId'
          | 'eventVersion'
          | 'eventVersionCreatedAt'
          | 'eventVersionUpdatedAt'
          | 'eventVersionIsDeleted'
          | 'periodicity'
          | 'startDate'
          | 'startTime'
          | 'endDate'
          | 'endTime'
          | 'selectedDate'
        >,
    ): ScheduleHistoryData => {
      const linkedWithAppletAt = override.eventVersionCreatedAt ?? '2025-03-12T00:00:00';

      return {
        appletId: '4a8ccced-51db-44d2-8a76-21a12bfd27ed',
        appletVersion: '1.1.0',
        appletName: 'Applet',
        eventType: 'activity',
        activityOrFlowId: 'activity-or-flow-id',
        activityOrFlowName: 'Activity or Flow',
        activityOrFlowHidden: false,
        eventUpdatedBy: 'some-admin-user-id',
        userId: null,
        subjectId: null,

        linkedWithAppletAt,
        accessBeforeSchedule: false,
        oneTimeCompletion: false,
        ...override,
      };
    };

    describe('Default schedule', () => {
      const defaultScheduleUser = 'default-schedule-user';
      const individualScheduleUser = 'individual-schedule-user';
      const individualScheduleUserSubject = 'individual-schedule-user-subject';
      describe('ALWAYS', () => {
        let scheduleHistoryData: ScheduleHistoryData[] = [];

        beforeEach(() => {
          scheduleHistoryData = [
            scheduleData({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v1',
              userId: null,
              subjectId: null,
              eventVersionCreatedAt: '2025-03-12T00:00:00',
              eventVersionUpdatedAt: '2025-03-12T00:00:00',
              eventVersionIsDeleted: false,
              periodicity: Periodicity.Always,
              startDate: null,
              startTime: '00:00:00',
              endDate: null,
              endTime: '23:59:00',
              selectedDate: null,
            }),
          ];
        });

        it('applies to every day (at least for the next 10 years)', () => {
          const creationDay = '2025-03-12';
          const tenYearsAfterCreation = '2035-03-12';

          exporter.daysBetweenInterval(creationDay, tenYearsAfterCreation).forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);
          });
        });

        describe('is overridden by an individual schedule', () => {
          it('ALWAYS -> ALWAYS', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: null,
              }),
            );

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Both schedules apply on the creation day
            ['2025-03-15'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
                expect.objectContaining({
                  eventId: 'individual-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Individual schedule applies after

            exporter.daysBetweenInterval('2025-03-16', '2035-03-16').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'individual-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });
          });

          it('ALWAYS -> ONCE', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: '2025-03-16',
              }),
            );

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Individual schedule applies on the selected date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-16',
              individualScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Once,
              }),
            ]);

            // Nothing applies after the selected date
            const theDayAfter = '2025-03-17';
            const tenYearsAfter = '2035-03-17';

            exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('ALWAYS -> DAILY', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Daily,
                startDate: '2025-03-16',
                startTime: '00:00:00',
                endDate: '2025-03-20',
                endTime: '23:59:00',
                selectedDate: null,
              }),
            );

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Individual schedule applies after
            ['2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20'].forEach(
              (day) => {
                const foundSchedules = exporter.findSchedulesForDay(
                  day,
                  individualScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Daily,
                  }),
                ]);
              },
            );

            // Nothing applies after the end date
            const theDayAfter = '2025-03-21';
            const tenYearsAfter = '2035-03-21';

            exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('ALWAYS -> WEEKLY', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekly,
                startDate: '2025-03-20',
                startTime: '00:00:00',
                endDate: '2025-03-31',
                endTime: '23:59:00',
                selectedDate: '2025-03-20',
              }),
            );

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Nothing applies until the start date of the Individual schedule
            ['2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });

            // Individual schedule applies after
            const applicableDays = ['2025-03-20', '2025-03-27'];
            exporter.daysBetweenInterval('2025-03-20', '2025-03-31').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Weekly,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies after the end date
            const theDayAfter = '2025-04-01';
            const tenYearsAfter = '2035-04-01';

            exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('ALWAYS -> WEEKDAYS', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekdays,
                startDate: '2025-03-15',
                startTime: '00:00:00',
                endDate: '2025-03-20',
                endTime: '23:59:00',
                selectedDate: null,
              }),
            );

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Individual schedule applies after
            const applicableDays = ['2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20'];
            const overlapDay = '2025-03-15';
            exporter.daysBetweenInterval('2025-03-15', '2025-03-20').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              if (day === overlapDay) {
                // We expect only the default schedule to show up on this day because it is not a weekday
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'default-schedule-event-1',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Always,
                  }),
                ]);
              } else if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Weekdays,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies after the end date
            const theDayAfter = '2025-03-21';
            const tenYearsAfter = '2035-03-21';

            exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('ALWAYS -> MONTHLY', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Monthly,
                startDate: '2025-05-01',
                startTime: '00:00:00',
                endDate: '2025-12-31',
                endTime: '23:59:00',
                selectedDate: '2025-05-01',
              }),
            );

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Nothing applies until the start date of the Individual schedule
            exporter.daysBetweenInterval('2025-03-16', '2025-04-30').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });

            // Individual schedule applies after
            const applicableDays = [
              '2025-05-01',
              '2025-06-01',
              '2025-07-01',
              '2025-08-01',
              '2025-09-01',
              '2025-10-01',
              '2025-11-01',
              '2025-12-01',
            ];
            exporter.daysBetweenInterval('2025-05-01', '2025-12-31').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Monthly,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies after the end date
            const theDayAfter = '2026-01-01';
            const tenYearsAfter = '2036-01-01';

            exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });
        });

        describe('takes precedence over a deleted individual schedule', () => {
          it('ALWAYS', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: null,
              }),
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-20T00:00:00',
                eventVersionIsDeleted: true,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '08:00:00',
                endDate: null,
                endTime: '09:00:00',
                selectedDate: null,
              }),
            ];

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // One day of overlap
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              individualScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // Individual schedule applies until it is deleted
            ['2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'individual-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // One day of overlap
            const foundSchedules2 = exporter.findSchedulesForDay(
              '2025-03-20',
              individualScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules2).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // Default schedule applies again thereafter
            exporter.daysBetweenInterval('2025-03-21', '2035-03-21').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });
          });

          it('ONCE', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '08:00:00',
                endDate: null,
                endTime: '09:00:00',
                selectedDate: null,
              }),
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-17T00:00:00',
                eventVersionIsDeleted: true,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '08:00:00',
                endDate: null,
                endTime: '09:00:00',
                selectedDate: '2025-03-16',
              }),
            ];

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Individual schedule applies on the selected date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-16',
              individualScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Once,
              }),
            ]);

            // Default schedule applies after the individual schedule's deletion, including on the deletion day
            exporter.daysBetweenInterval('2025-03-17', '2035-03-17').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });
          });

          it('DAILY', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '06:00:00',
                endDate: null,
                endTime: '07:00:00',
                selectedDate: null,
              }),
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-18T00:00:00',
                eventVersionIsDeleted: true,
                periodicity: Periodicity.Daily,
                startDate: '2025-03-15',
                startTime: '08:00:00',
                endDate: '2025-03-19',
                endTime: '09:00:00',
                selectedDate: null,
              }),
            ];

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // One day of overlap
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              individualScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Daily,
              }),
            ]);

            // Individual schedule applies until deleted
            ['2025-03-16', '2025-03-17'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'individual-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Daily,
                }),
              ]);
            });

            // One more day of overlap on the deletion day
            const foundSchedules2 = exporter.findSchedulesForDay(
              '2025-03-18',
              individualScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules2).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Daily,
              }),
            ]);

            // Default schedule applies afterwards
            exporter.daysBetweenInterval('2025-03-19', '2035-03-18').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });
          });

          it('WEEKLY', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: null,
              }),
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-27T07:00:00',
                eventVersionIsDeleted: true,
                periodicity: Periodicity.Weekly,
                startDate: '2025-03-20',
                startTime: '08:00:00',
                endDate: '2025-03-31',
                endTime: '09:00:00',
                selectedDate: '2025-03-20',
              }),
            ];

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            const applicableDays = ['2025-03-20'];

            // Individual schedule applies until deleted
            exporter.daysBetweenInterval('2025-03-16', '2025-03-26').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Weekly,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // The two schedules overlap on the deletion day because they are both applicable
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-27',
              individualScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Weekly,
              }),
            ]);

            // Default schedule applies afterwards
            exporter.daysBetweenInterval('2025-03-28', '2035-03-28').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });
          });

          it('WEEKDAYS', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: null,
              }),
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-27T07:00:00',
                eventVersionIsDeleted: true,
                periodicity: Periodicity.Weekdays,
                startDate: '2025-03-15',
                startTime: '08:00:00',
                endDate: '2025-03-20',
                endTime: '09:00:00',
                selectedDate: null,
              }),
            ];

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            const applicableDays = ['2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20'];

            // One day of overlap on the 15th, but the weekday schedule doesn't show up because
            // the 15th isn't a weekday
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              individualScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // Individual schedule applies until end date
            exporter.daysBetweenInterval('2025-03-16', '2025-03-26').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Weekdays,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies until the individual schedule deletion date
            exporter.daysBetweenInterval('2025-03-21', '2025-03-26').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });

            // Default schedule applies on the deletion date and afterwards
            exporter.daysBetweenInterval('2025-03-27', '2035-03-27').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });
          });

          it('MONTHLY', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: null,
              }),
              scheduleData({
                eventId: 'individual-schedule-event-1',
                eventVersion: 'v1',
                userId: individualScheduleUser,
                subjectId: individualScheduleUserSubject,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-08-10T07:00:00',
                eventVersionIsDeleted: true,
                periodicity: Periodicity.Monthly,
                startDate: '2025-05-01',
                startTime: '08:00:00',
                endDate: '2025-12-31',
                endTime: '09:00:00',
                selectedDate: '2025-05-01',
              }),
            ];

            // Default schedule applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Nothing applies until the start date
            exporter.daysBetweenInterval('2025-03-16', '2025-04-30').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });

            const applicableDays = ['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01'];

            // Individual schedule applies until deleted
            exporter.daysBetweenInterval('2025-03-16', '2025-08-09').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Monthly,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Default schedule applies on the deletion date and afterwards
            exporter.daysBetweenInterval('2025-08-10', '2035-08-10').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });
          });
        });

        describe('is overridden by new schedule version', () => {
          it('ALWAYS -> ALWAYS', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                oneTimeCompletion: true,
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: null,
              }),
            );

            // v1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // One day of overlap on the 15th
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                periodicity: Periodicity.Always,
              }),
            ]);

            // v2 applies after
            exporter.daysBetweenInterval('2025-03-16', '2035-03-16').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });
          });

          it('ALWAYS -> ONCE', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: '2025-03-15',
              }),
            );

            // v1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Both versions appear on the selected date because it is the
            // same as the creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                periodicity: Periodicity.Once,
              }),
            ]);

            // Nothing applies after the selected date
            exporter.daysBetweenInterval('2025-03-16', '2035-03-16').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('ALWAYS -> DAILY', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Daily,
                startDate: '2025-03-15',
                startTime: '00:00:00',
                endDate: '2025-03-19',
                endTime: '23:59:00',
                selectedDate: null,
              }),
            );

            // v1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // One day of overlap on the v2 creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                periodicity: Periodicity.Daily,
              }),
            ]);

            // v2 applies after
            ['2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  periodicity: Periodicity.Daily,
                }),
              ]);
            });

            // Nothing applies after the end date
            exporter.daysBetweenInterval('2025-03-20', '2035-03-20').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('ALWAYS -> WEEKLY', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekly,
                startDate: '2025-03-20',
                startTime: '00:00:00',
                endDate: '2025-03-31',
                endTime: '23:59:00',
                selectedDate: '2025-03-20',
              }),
            );

            // v1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // v1 still applies on the v2 creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // Nothing applies until the start date of v2
            ['2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });

            // v2 applies after its start date
            const applicableDays = ['2025-03-20', '2025-03-27'];
            exporter.daysBetweenInterval('2025-03-20', '2025-03-31').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'default-schedule-event-1',
                    eventVersion: 'v2',
                    periodicity: Periodicity.Weekly,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies after the end date
            exporter.daysBetweenInterval('2025-04-01', '2035-04-01').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('ALWAYS -> WEEKDAYS', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekdays,
                startDate: '2025-03-15',
                startTime: '00:00:00',
                endDate: '2025-03-20',
                endTime: '23:59:00',
                selectedDate: null,
              }),
            );

            // v1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // v1 still applies on the v2 creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // v2 applies after
            const applicableDays = ['2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20'];
            exporter.daysBetweenInterval('2025-03-16', '2025-03-20').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'default-schedule-event-1',
                    eventVersion: 'v2',
                    periodicity: Periodicity.Weekdays,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies after the end date
            exporter.daysBetweenInterval('2025-03-21', '2035-03-21').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('ALWAYS -> MONTHLY', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Monthly,
                startDate: '2025-05-01',
                startTime: '00:00:00',
                endDate: '2025-12-31',
                endTime: '23:59:00',
                selectedDate: '2025-05-01',
              }),
            );

            // v1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // v1 still applies on the v2 creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // Nothing applies until the start date of v2
            exporter.daysBetweenInterval('2025-03-16', '2025-04-30').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });

            // v2 applies after its start date
            const applicableDays = [
              '2025-05-01',
              '2025-06-01',
              '2025-07-01',
              '2025-08-01',
              '2025-09-01',
              '2025-10-01',
              '2025-11-01',
              '2025-12-01',
            ];
            exporter.daysBetweenInterval('2025-05-01', '2025-12-31').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'default-schedule-event-1',
                    eventVersion: 'v2',
                    periodicity: Periodicity.Monthly,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies after the end date
            exporter.daysBetweenInterval('2026-01-01', '2036-01-01').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });
        });

        describe('is replaced by new separate schedule', () => {
          it('ALWAYS', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                oneTimeCompletion: true,
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: null,
              }),
            );

            // schedule 1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // schedule 1 still applies on the schedule 2 creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // schedule 2 applies after
            exporter.daysBetweenInterval('2025-03-16', '2035-03-16').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-2',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });
          });

          it('ONCE', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: '2025-03-15',
              }),
            );

            // schedule 1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // schedule 2 applies on the selected date, but schedule 1 also applies
            // because it is the creation date of schedule 2
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                periodicity: Periodicity.Once,
              }),
            ]);

            // Nothing applies after the selected date
            exporter.daysBetweenInterval('2025-03-16', '2035-03-16').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('DAILY', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Daily,
                startDate: '2025-03-15',
                startTime: '00:00:00',
                endDate: '2025-03-19',
                endTime: '23:59:00',
                selectedDate: null,
              }),
            );

            // schedule 1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // Both apply on schedule 2 creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                periodicity: Periodicity.Daily,
              }),
            ]);

            // schedule 2 applies after
            ['2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-2',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Daily,
                }),
              ]);
            });

            // Nothing applies after the end date
            exporter.daysBetweenInterval('2025-03-20', '2035-03-20').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('WEEKLY', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekly,
                startDate: '2025-03-20',
                startTime: '00:00:00',
                endDate: '2025-03-31',
                endTime: '23:59:00',
                selectedDate: '2025-03-20',
              }),
            );

            // schedule 1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // schedule 1 also applies on schedule 2 creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // Nothing applies until the start date of schedule 2
            ['2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });

            // schedule 2 applies after its start date
            const applicableDays = ['2025-03-20', '2025-03-27'];
            exporter.daysBetweenInterval('2025-03-20', '2025-03-31').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'default-schedule-event-2',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Weekly,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies after the end date
            exporter.daysBetweenInterval('2025-04-01', '2035-04-01').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('WEEKDAYS', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekdays,
                startDate: '2025-03-15',
                startTime: '00:00:00',
                endDate: '2025-03-20',
                endTime: '23:59:00',
                selectedDate: null,
              }),
            );

            // schedule 1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // schedule 1 also applies on schedule 2 creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // schedule 2 applies after
            const applicableDays = ['2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20'];
            exporter.daysBetweenInterval('2025-03-16', '2025-03-20').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'default-schedule-event-2',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Weekdays,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies after the end date
            exporter.daysBetweenInterval('2025-03-21', '2035-03-21').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });

          it('MONTHLY', () => {
            scheduleHistoryData.push(
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-15T00:00:00',
                eventVersionUpdatedAt: '2025-03-15T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Monthly,
                startDate: '2025-05-01',
                startTime: '00:00:00',
                endDate: '2025-12-31',
                endTime: '23:59:00',
                selectedDate: '2025-05-01',
              }),
            );

            // schedule 1 applies at first
            ['2025-03-12', '2025-03-13', '2025-03-14'].forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Always,
                }),
              ]);
            });

            // schedule 1 also applies on schedule 2 creation date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);

            // Nothing applies until the start date of schedule 2
            exporter.daysBetweenInterval('2025-03-16', '2025-04-30').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });

            // schedule 2 applies after its start date
            const applicableDays = [
              '2025-05-01',
              '2025-06-01',
              '2025-07-01',
              '2025-08-01',
              '2025-09-01',
              '2025-10-01',
              '2025-11-01',
              '2025-12-01',
            ];
            exporter.daysBetweenInterval('2025-05-01', '2025-12-31').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              if (applicableDays.includes(day)) {
                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'default-schedule-event-2',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Monthly,
                  }),
                ]);
              } else {
                expect(foundSchedules).toEqual([]);
              }
            });

            // Nothing applies after the end date
            exporter.daysBetweenInterval('2026-01-01', '2036-01-01').forEach((day) => {
              const foundSchedules = exporter.findSchedulesForDay(
                day,
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);
            });
          });
        });

        it('is not present when missing from individual schedule', () => {
          scheduleHistoryData.push(
            scheduleData({
              eventId: 'individual-schedule-event-1',
              eventVersion: 'v1',
              userId: individualScheduleUser,
              subjectId: individualScheduleUserSubject,
              eventVersionCreatedAt: '2025-03-12T00:00:00',
              eventVersionUpdatedAt: '2025-03-12T00:00:00',
              eventVersionIsDeleted: false,
              periodicity: Periodicity.Always,
              startDate: null,
              startTime: '00:00:00',
              endDate: null,
              endTime: '23:59:00',
              selectedDate: null,
            }),
            // This default schedule event is for a different activity
            scheduleData({
              activityOrFlowId: 'activity-or-flow-id-2',
              activityOrFlowName: 'Activity or Flow 2',
              eventId: 'default-schedule-event-2',
              eventVersion: 'v1',
              userId: null,
              subjectId: null,
              eventVersionCreatedAt: '2025-03-13T00:00:00',
              eventVersionUpdatedAt: '2025-03-13T00:00:00',
              eventVersionIsDeleted: false,
              periodicity: Periodicity.Always,
              startDate: null,
              startTime: '00:00:00',
              endDate: null,
              endTime: '23:59:00',
              selectedDate: null,
            }),
          );

          // Default schedule event 2 should not be present for the individual schedule user
          const foundSchedules = exporter.findSchedulesForDay(
            '2025-03-13',
            individualScheduleUser,
            scheduleHistoryData,
          );

          expect(foundSchedules).toEqual([
            expect.objectContaining({
              eventId: 'individual-schedule-event-1',
              eventVersion: 'v1',
              periodicity: Periodicity.Always,
            }),
          ]);
        });
      });

      describe('ONCE', () => {
        let scheduleHistoryData: ScheduleHistoryData[] = [];

        beforeEach(() => {
          scheduleHistoryData = [
            scheduleData({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v1',
              userId: null,
              subjectId: null,
              eventVersionCreatedAt: '2025-03-12T00:00:00',
              eventVersionUpdatedAt: '2025-03-12T00:00:00',
              eventVersionIsDeleted: false,
              periodicity: Periodicity.Once,
              startDate: null,
              startTime: '00:00:00',
              endDate: null,
              endTime: '23:59:00',
              selectedDate: '2025-03-16',
            }),
          ];
        });

        it('does not apply before the selected date', () => {
          ['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15'].forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([]);
          });
        });

        it('applies on the selected date', () => {
          const foundSchedules = exporter.findSchedulesForDay(
            '2025-03-16',
            defaultScheduleUser,
            scheduleHistoryData,
          );

          expect(foundSchedules).toEqual([
            expect.objectContaining({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v1',
              periodicity: Periodicity.Once,
            }),
          ]);
        });

        it('does not apply after the selected date', () => {
          const foundSchedules = exporter.findSchedulesForDay(
            '2025-03-17',
            defaultScheduleUser,
            scheduleHistoryData,
          );

          expect(foundSchedules).toEqual([]);
        });

        describe('coexists with new separate schedule', () => {
          it('ALWAYS', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '08:00:00',
                endDate: null,
                endTime: '09:00:00',
                selectedDate: '2025-03-16',
              }),
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:01:00',
                eventVersionUpdatedAt: '2025-03-12T00:01:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Always,
                startDate: null,
                startTime: '08:00:00',
                endDate: null,
                endTime: '09:00:00',
                selectedDate: null,
              }),
            ];

            // only schedule 2 applies on the 16th, because always available overrides previous schedules
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-16',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                periodicity: Periodicity.Always,
              }),
            ]);
          });

          it('ONCE', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: '2025-03-16',
              }),
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:01:00',
                eventVersionUpdatedAt: '2025-03-12T00:01:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: '2025-03-16',
              }),
            ];

            // Both schedules apply on the selected date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-16',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Once,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                periodicity: Periodicity.Once,
              }),
            ]);
          });

          it('DAILY', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: '2025-03-16',
              }),
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:01:00',
                eventVersionUpdatedAt: '2025-03-12T00:01:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Daily,
                startDate: '2025-03-15',
                startTime: '00:00:00',
                endDate: '2025-03-17',
                endTime: '23:59:00',
                selectedDate: null,
              }),
            ];

            // Both schedules apply on the selected date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-16',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Once,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                periodicity: Periodicity.Daily,
              }),
            ]);
          });

          it('WEEKLY', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: '2025-03-16',
              }),
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:01:00',
                eventVersionUpdatedAt: '2025-03-12T00:01:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekly,
                startDate: '2025-03-16',
                startTime: '00:00:00',
                endDate: '2025-03-31',
                endTime: '23:59:00',
                selectedDate: '2025-03-16',
              }),
            ];

            // Both schedules apply on the selected date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-16',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Once,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                periodicity: Periodicity.Weekly,
              }),
            ]);
          });

          it('WEEKDAYS', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: '2025-03-17',
              }),
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:01:00',
                eventVersionUpdatedAt: '2025-03-12T00:01:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekdays,
                startDate: '2025-03-12',
                startTime: '00:00:00',
                endDate: '2025-03-31',
                endTime: '23:59:00',
                selectedDate: null,
              }),
            ];

            // Both schedules apply on the selected date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-17',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Once,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                periodicity: Periodicity.Weekdays,
              }),
            ]);
          });

          it('MONTHLY', () => {
            scheduleHistoryData = [
              scheduleData({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:00:00',
                eventVersionUpdatedAt: '2025-03-12T00:00:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '00:00:00',
                endDate: null,
                endTime: '23:59:00',
                selectedDate: '2025-03-16',
              }),
              scheduleData({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:01:00',
                eventVersionUpdatedAt: '2025-03-12T00:01:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Monthly,
                startDate: '2025-03-16',
                startTime: '00:00:00',
                endDate: '2025-12-31',
                endTime: '23:59:00',
                selectedDate: '2025-03-16',
              }),
            ];

            // Both schedules apply on the selected date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-16',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Once,
              }),
              expect.objectContaining({
                eventId: 'default-schedule-event-2',
                eventVersion: 'v1',
                periodicity: Periodicity.Monthly,
              }),
            ]);
          });
        });
      });

      describe('DAILY', () => {
        const scheduleHistoryData: ScheduleHistoryData[] = [
          scheduleData({
            eventId: 'default-schedule-event-1',
            eventVersion: 'v1',
            userId: null,
            subjectId: null,
            eventVersionCreatedAt: '2025-03-12T00:00:00',
            eventVersionUpdatedAt: '2025-03-12T00:00:00',
            eventVersionIsDeleted: false,
            periodicity: Periodicity.Daily,
            startDate: '2025-03-14',
            startTime: '00:00:00',
            endDate: '2025-03-15',
            endTime: '23:59:00',
            selectedDate: null,
          }),
        ];

        it('does not apply before the start date', () => {
          ['2025-03-12', '2025-03-13'].forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([]);
          });
        });

        it('does not apply before the creation date', () => {
          // A version of a schedule that has a start date before its creation date.
          // This can happen when this is a new version of an existing schedule
          const scheduleHistoryData = [
            scheduleData({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v1',
              userId: null,
              subjectId: null,
              eventVersionCreatedAt: '2025-01-03T00:00:00',
              eventVersionUpdatedAt: '2025-01-03T00:00:00',
              eventVersionIsDeleted: false,
              periodicity: Periodicity.Daily,
              startDate: '2025-01-03',
              startTime: '00:00:00',
              endDate: '2025-12-31',
              endTime: '23:59:00',
              selectedDate: null,
            }),
            scheduleData({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v2',
              userId: null,
              subjectId: null,
              eventVersionCreatedAt: '2025-12-30T00:00:00',
              eventVersionUpdatedAt: '2025-12-30T00:00:00',
              eventVersionIsDeleted: false,
              periodicity: Periodicity.Daily,
              startDate: '2025-01-03',
              startTime: '00:00:00',
              endDate: '2025-12-31',
              endTime: '23:59:00',
              selectedDate: null,
            }),
          ];

          // v1 shows up at first
          exporter.daysBetweenInterval('2025-01-03', '2025-12-29').forEach((day) => {
            // Schedule does not apply before creation date
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Daily,
              }),
            ]);
          });

          // One day of overlap between v1 and v2
          let foundSchedules = exporter.findSchedulesForDay(
            '2025-12-30',
            defaultScheduleUser,
            scheduleHistoryData,
          );

          expect(foundSchedules).toEqual([
            expect.objectContaining({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v1',
              periodicity: Periodicity.Daily,
            }),
            expect.objectContaining({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v2',
              periodicity: Periodicity.Daily,
            }),
          ]);

          // v2 shows up on the days after it was created
          foundSchedules = exporter.findSchedulesForDay(
            '2025-12-31',
            defaultScheduleUser,
            scheduleHistoryData,
          );

          expect(foundSchedules).toEqual([
            expect.objectContaining({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v2',
              periodicity: Periodicity.Daily,
            }),
          ]);
        });

        it('applies daily between the start and end date', () => {
          ['2025-03-14', '2025-03-15'].forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Daily,
              }),
            ]);
          });
        });

        it('does not apply after the end date', () => {
          const day = '2025-03-16';

          const foundSchedules = exporter.findSchedulesForDay(
            day,
            defaultScheduleUser,
            scheduleHistoryData,
          );

          expect(foundSchedules).toEqual([]);
        });
      });

      describe('WEEKLY', () => {
        const scheduleHistoryData: ScheduleHistoryData[] = [
          scheduleData({
            eventId: 'default-schedule-event-1',
            eventVersion: 'v1',
            userId: null,
            subjectId: null,
            eventVersionCreatedAt: '2025-03-12T00:00:00',
            eventVersionUpdatedAt: '2025-03-12T00:00:00',
            eventVersionIsDeleted: false,
            periodicity: Periodicity.Weekly,
            startDate: '2025-03-20',
            startTime: '00:00:00',
            endDate: '2025-03-31',
            endTime: '23:59:00',
            selectedDate: '2025-03-20',
          }),
        ];

        it('does not apply before the start date', () => {
          exporter.daysBetweenInterval('2025-03-12', '2025-03-19').forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([]);
          });
        });

        it('does not apply before the creation date', () => {
          // A version of a schedule that has a start date before its creation date.
          // This can happen when this is a new version of an existing schedule
          const event = scheduleData({
            eventId: 'default-schedule-event-1',
            eventVersion: '',
            userId: null,
            subjectId: null,
            eventVersionCreatedAt: '2025-01-03T00:00:00',
            eventVersionUpdatedAt: '2025-01-03T00:00:00',
            eventVersionIsDeleted: false,
            periodicity: Periodicity.Weekly,
            startDate: '2025-01-03',
            startTime: '00:00:00',
            endDate: '2025-04-03',
            endTime: '23:59:00',
            selectedDate: '2025-01-03',
          });

          const scheduleHistoryData = [
            { ...event, eventVersion: 'v1' },
            {
              ...event,
              eventVersion: 'v2',
              eventVersionCreatedAt: '2025-03-03T00:00:00',
              eventVersionUpdatedAt: '2025-03-03T00:00:00',
              endTime: '23:59:59',
            },
          ];

          let applicableDays = [
            '2025-01-03',
            '2025-01-10',
            '2025-01-17',
            '2025-01-24',
            '2025-01-31',
            '2025-02-07',
            '2025-02-14',
            '2025-02-21',
            '2025-02-28',
          ];

          exporter.daysBetweenInterval('2025-01-03', '2025-03-03').forEach((day) => {
            // Schedule does not apply before creation date
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            if (applicableDays.includes(day)) {
              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Weekly,
                }),
              ]);
            } else {
              expect(foundSchedules).toEqual([]);
            }
          });

          applicableDays = ['2025-03-07', '2025-03-14', '2025-03-21', '2025-03-28'];

          exporter.daysBetweenInterval('2025-03-03', '2025-04-03').forEach((day) => {
            // Schedule does not apply before creation date
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            if (applicableDays.includes(day)) {
              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  periodicity: Periodicity.Weekly,
                }),
              ]);
            } else {
              expect(foundSchedules).toEqual([]);
            }
          });
        });

        it('applies weekly between the start and end date', () => {
          const applicableDays = ['2025-03-20', '2025-03-27'];
          exporter.daysBetweenInterval('2025-03-20', '2025-03-31').forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            if (applicableDays.includes(day)) {
              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Weekly,
                }),
              ]);
            } else {
              expect(foundSchedules).toEqual([]);
            }
          });
        });

        it('does not apply after the end date', () => {
          ['2025-04-03', '2025-04-10'].forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([]);
          });
        });
      });

      describe('WEEKDAYS', () => {
        const scheduleHistoryData: ScheduleHistoryData[] = [
          scheduleData({
            eventId: 'default-schedule-event-1',
            eventVersion: 'v1',
            userId: null,
            subjectId: null,
            eventVersionCreatedAt: '2025-03-08T00:00:00',
            eventVersionUpdatedAt: '2025-03-08T00:00:00',
            eventVersionIsDeleted: false,
            periodicity: Periodicity.Weekdays,
            startDate: '2025-03-08',
            startTime: '00:00:00',
            endDate: '2025-03-13',
            endTime: '23:59:00',
            selectedDate: null,
          }),
        ];

        it('does not apply to non-weekdays after the start date', () => {
          ['2025-03-08', '2025-03-09'].forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([]);
          });
        });

        it('does not apply before the creation date', () => {
          // A version of a schedule that has a start date before its creation date.
          // This can happen when this is a new version of an existing schedule
          const event = scheduleData({
            eventId: 'default-schedule-event-1',
            eventVersion: '',
            userId: null,
            subjectId: null,
            eventVersionCreatedAt: '2025-01-03T00:00:00',
            eventVersionUpdatedAt: '2025-01-03T00:00:00',
            eventVersionIsDeleted: false,
            periodicity: Periodicity.Weekdays,
            startDate: '2025-01-03',
            startTime: '00:00:00',
            endDate: '2025-01-17',
            endTime: '23:59:00',
            selectedDate: null,
          });

          const scheduleHistoryData = [
            { ...event, eventVersion: 'v1' },
            {
              ...event,
              eventVersion: 'v2',
              eventVersionCreatedAt: '2025-01-10T00:00:00',
              eventVersionUpdatedAt: '2025-01-10T00:00:00',
              endTime: '23:59:59',
            },
          ];

          let applicableDays = [
            '2025-01-03',
            '2025-01-06',
            '2025-01-07',
            '2025-01-08',
            '2025-01-09',
          ];

          exporter.daysBetweenInterval('2025-01-03', '2025-01-09').forEach((day) => {
            // Schedule does not apply before creation date
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            if (applicableDays.includes(day)) {
              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Weekdays,
                }),
              ]);
            } else {
              expect(foundSchedules).toEqual([]);
            }
          });

          // One day of overlap between v1 and v2
          const foundSchedules = exporter.findSchedulesForDay(
            '2025-01-10',
            defaultScheduleUser,
            scheduleHistoryData,
          );

          expect(foundSchedules).toEqual([
            expect.objectContaining({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v1',
              periodicity: Periodicity.Weekdays,
            }),
            expect.objectContaining({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v2',
              periodicity: Periodicity.Weekdays,
            }),
          ]);

          applicableDays = ['2025-01-13', '2025-01-14', '2025-01-15', '2025-01-16', '2025-01-17'];

          exporter.daysBetweenInterval('2025-01-11', '2025-01-17').forEach((day) => {
            // Schedule does not apply before creation date
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            if (applicableDays.includes(day)) {
              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  periodicity: Periodicity.Weekdays,
                }),
              ]);
            } else {
              expect(foundSchedules).toEqual([]);
            }
          });
        });

        it('applies to weekdays between the start and end dates', () => {
          ['2025-03-10', '2025-03-11', '2025-03-12', '2025-03-13'].forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v1',
                periodicity: Periodicity.Weekdays,
              }),
            ]);
          });
        });

        it('does not apply to weekdays after the end date', () => {
          const foundSchedules = exporter.findSchedulesForDay(
            '2025-03-14',
            defaultScheduleUser,
            scheduleHistoryData,
          );

          expect(foundSchedules).toEqual([]);
        });
      });

      describe('MONTHLY', () => {
        let scheduleHistoryData: ScheduleHistoryData[] = [];

        beforeEach(() => {
          scheduleHistoryData = [
            scheduleData({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v1',
              userId: null,
              subjectId: null,
              eventVersionCreatedAt: '2025-03-01T00:00:00',
              eventVersionUpdatedAt: '2025-03-01T00:00:00',
              eventVersionIsDeleted: false,
              periodicity: Periodicity.Monthly,
              startDate: '2025-05-01',
              startTime: '00:00:00',
              endDate: '2025-12-31',
              endTime: '23:59:00',
              selectedDate: '2025-05-01',
            }),
          ];
        });

        it('does not apply before the start date', () => {
          exporter.daysBetweenInterval('2025-03-01', '2025-04-30').forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([]);
          });
        });

        it('does not apply before the creation date', () => {
          // A version of a schedule that has a start date before its creation date.
          // This can happen when this is a new version of an existing schedule
          const event = scheduleData({
            eventId: 'default-schedule-event-1',
            eventVersion: '',
            userId: null,
            subjectId: null,
            eventVersionCreatedAt: '2025-01-03T00:00:00',
            eventVersionUpdatedAt: '2025-01-03T00:00:00',
            eventVersionIsDeleted: false,
            periodicity: Periodicity.Monthly,
            startDate: '2025-01-03',
            startTime: '00:00:00',
            endDate: '2025-04-03',
            endTime: '23:59:00',
            selectedDate: '2025-01-03',
          });

          const scheduleHistoryData = [
            { ...event, eventVersion: 'v1' },
            {
              ...event,
              eventVersion: 'v2',
              eventVersionCreatedAt: '2025-03-03T00:00:00',
              eventVersionUpdatedAt: '2025-03-03T00:00:00',
              endTime: '23:59:59',
            },
          ];

          let applicableDays = ['2025-01-03', '2025-02-03'];

          exporter.daysBetweenInterval('2025-01-03', '2025-03-02').forEach((day) => {
            // Schedule does not apply before creation date
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            if (applicableDays.includes(day)) {
              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Monthly,
                }),
              ]);
            } else {
              expect(foundSchedules).toEqual([]);
            }
          });

          // One day of overlap between v1 and v2
          const foundSchedules = exporter.findSchedulesForDay(
            '2025-03-03',
            defaultScheduleUser,
            scheduleHistoryData,
          );

          expect(foundSchedules).toEqual([
            expect.objectContaining({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v1',
              periodicity: Periodicity.Monthly,
            }),
            expect.objectContaining({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v2',
              periodicity: Periodicity.Monthly,
            }),
          ]);

          // v2 applies thereafter
          applicableDays = ['2025-04-03'];
          exporter.daysBetweenInterval('2025-03-04', '2025-04-03').forEach((day) => {
            // Schedule does not apply before creation date
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            if (applicableDays.includes(day)) {
              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  periodicity: Periodicity.Monthly,
                }),
              ]);
            } else {
              expect(foundSchedules).toEqual([]);
            }
          });
        });

        it('applies monthly between the start and end dates', () => {
          const applicableDays = [
            '2025-05-01',
            '2025-06-01',
            '2025-07-01',
            '2025-08-01',
            '2025-09-01',
            '2025-10-01',
            '2025-11-01',
            '2025-12-01',
          ];

          exporter.daysBetweenInterval('2025-05-01', '2025-12-31').forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            if (applicableDays.includes(day)) {
              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Monthly,
                }),
              ]);
            } else {
              expect(foundSchedules).toEqual([]);
            }
          });
        });

        it('truncates at the end of the month for shorter months', () => {
          scheduleHistoryData = [
            scheduleData({
              eventId: 'default-schedule-event-1',
              eventVersion: 'v1',
              userId: null,
              subjectId: null,
              eventVersionCreatedAt: '2025-01-01T00:00:00',
              eventVersionUpdatedAt: '2025-01-01T00:00:00',
              eventVersionIsDeleted: false,
              periodicity: Periodicity.Monthly,
              startDate: '2025-01-31',
              startTime: '00:00:00',
              endDate: '2025-12-31',
              endTime: '23:59:00',
              selectedDate: '2025-01-31',
            }),
          ];

          const applicableDays = [
            '2025-01-31',
            '2025-02-28',
            '2025-03-31',
            '2025-04-30',
            '2025-05-31',
            '2025-06-30',
            '2025-07-31',
            '2025-08-31',
            '2025-09-30',
            '2025-10-31',
            '2025-11-30',
            '2025-12-31',
          ];

          exporter.daysBetweenInterval('2025-01-01', '2025-12-31').forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            if (applicableDays.includes(day)) {
              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v1',
                  periodicity: Periodicity.Monthly,
                }),
              ]);
            } else {
              expect(foundSchedules).toEqual([]);
            }
          });
        });

        it('does not apply after the end date', () => {
          ['2026-01-01', '2026-02-01'].forEach((day) => {
            const foundSchedules = exporter.findSchedulesForDay(
              day,
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([]);
          });
        });
      });
    });
  });

  describe('findLatestMobileSchedule', () => {
    const userId = '053bb3b6-57d4-4c4a-adb3-dedff951ec7b';
    const deviceId =
      'eW0gjZDRQ1yoRxgJyD4uHU:APA91bEqR9g5YXnUG0hXZEsl3ZftQBfcm6xS4zvWpZJx27mxZLweG_Qx0sp4Xc7IoaR1M0Ux79-FVXTPSNIcxvuVFeNHQbM8MXA35m-drkdZG8gLUDUr10lcQ6pTKcXQaJ9AaFIxOCc9';
    const eventId = '42153ce6-332c-4e1b-b6f8-97b72e40596f';
    const userTimeZone = 'Etc/UTC';

    const scheduleHistoryEvent: ScheduleHistoryData = {
      appletId: '4a8ccced-51db-44d2-8a76-21a12bfd27ed',
      appletVersion: '1.1.0',
      appletName: 'Applet',
      eventType: 'activity',
      activityOrFlowId: 'activity-or-flow-id',
      activityOrFlowName: 'Activity or Flow',
      activityOrFlowHidden: false,
      eventUpdatedBy: 'some-admin-user-id',
      userId: null,
      subjectId: null,

      linkedWithAppletAt: '2025-03-12T00:00:00',
      accessBeforeSchedule: false,
      oneTimeCompletion: false,
      eventId,
      eventVersion: '20250312-1',
      eventVersionCreatedAt: '2025-03-12T00:00:00',
      eventVersionUpdatedAt: '2025-03-12T00:00:00',
      eventVersionIsDeleted: false,
      periodicity: Periodicity.Always,
      startDate: null,
      startTime: '00:00:00',
      endDate: null,
      endTime: '23:59:00',
      selectedDate: null,
    };

    describe('device has current schedule', () => {
      it('from one record', () => {
        const deviceHistoryData: DeviceScheduleHistoryData[] = [
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: scheduleHistoryEvent.eventVersion,
            createdAt: '2025-03-12T00:00:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
        ];

        const latestMobileSchedule = exporter.findLatestMobileSchedule(
          '2025-03-12',
          userId,
          scheduleHistoryEvent,
          deviceHistoryData,
        );

        expect(latestMobileSchedule).toEqual(deviceHistoryData[0]);
      });

      it('from multiple records', () => {
        const deviceHistoryData: DeviceScheduleHistoryData[] = [
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: '20250311-1',
            createdAt: '2025-03-11T00:00:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: '20250311-2',
            createdAt: '2025-03-11T00:05:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: scheduleHistoryEvent.eventVersion,
            createdAt: '2025-03-12T00:00:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
        ];

        const latestMobileSchedule = exporter.findLatestMobileSchedule(
          '2025-03-12',
          userId,
          scheduleHistoryEvent,
          deviceHistoryData,
        );

        expect(latestMobileSchedule).toEqual(deviceHistoryData[2]);
      });

      it('from multiple devices', () => {
        const deviceHistoryData: DeviceScheduleHistoryData[] = [
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: '20250311-1',
            createdAt: '2025-03-11T00:00:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
          {
            userId,
            deviceId:
              'eVdMYFiYTImqG3vynCBXWy:APA91bFbR3KEyvGlB0x0TDCQGhBd_stWm1ZVMqOZqhUrz2a6j6-chV3RabpnGQblogJ-FVOdGsgkQcMHiUzcZTh7Axo8cJ4ZLFaLXAJiQdFZtlvpEl58Z48dYopdzOBEu-f-bGb379H5',
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: '20250311-2',
            createdAt: '2025-03-11T00:05:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: scheduleHistoryEvent.eventVersion,
            createdAt: '2025-03-12T00:00:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
        ];

        const latestMobileSchedule = exporter.findLatestMobileSchedule(
          '2025-03-12',
          userId,
          scheduleHistoryEvent,
          deviceHistoryData,
        );

        expect(latestMobileSchedule).toEqual(deviceHistoryData[2]);
      });

      it('downloaded after event end time', () => {
        const deviceHistoryData: DeviceScheduleHistoryData[] = [
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: '20250311-1',
            createdAt: '2025-03-11T00:00:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: '20250311-2',
            createdAt: '2025-03-11T00:05:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: scheduleHistoryEvent.eventVersion,
            createdAt: '2025-03-12T10:00:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
        ];

        const latestMobileSchedule = exporter.findLatestMobileSchedule(
          '2025-03-12',
          userId,
          { ...scheduleHistoryEvent, endTime: '09:00:00' },
          deviceHistoryData,
        );

        expect(latestMobileSchedule).toEqual(deviceHistoryData[1]);
      });
    });

    it('device has no downloaded schedule', () => {
      const latestMobileSchedule = exporter.findLatestMobileSchedule(
        '2025-03-12',
        userId,
        scheduleHistoryEvent,
        [],
      );

      expect(latestMobileSchedule).toBeNull();
    });

    it('does not use unrelated schedule', () => {
      const deviceHistoryData: DeviceScheduleHistoryData[] = [
        {
          userId,
          deviceId,
          eventId: 'fce917c4-15ab-4654-9fa5-218ac3bfc606',
          eventVersion: '20250312-1',
          createdAt: '2025-03-12T00:00:00',
          startDate: '2025-03-12',
          startTime: '00:00:00',
          endDate: '2025-12-31',
          endTime: '23:59:00',
          accessBeforeSchedule: false,
          userTimeZone,
        },
      ];

      const latestMobileSchedule = exporter.findLatestMobileSchedule(
        '2025-03-12',
        userId,
        scheduleHistoryEvent,
        deviceHistoryData,
      );

      expect(latestMobileSchedule).toBeNull();
    });

    describe('does not use newer schedule version', () => {
      it('same day', () => {
        const deviceHistoryData: DeviceScheduleHistoryData[] = [
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: '20250312-2',
            createdAt: '2025-03-12T00:00:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
        ];

        const latestMobileSchedule = exporter.findLatestMobileSchedule(
          '2025-03-12',
          userId,
          scheduleHistoryEvent,
          deviceHistoryData,
        );

        expect(latestMobileSchedule).toBeNull();
      });

      it('different day', () => {
        const deviceHistoryData: DeviceScheduleHistoryData[] = [
          {
            userId,
            deviceId,
            eventId: scheduleHistoryEvent.eventId,
            eventVersion: '20250313-1',
            createdAt: '2025-03-13T00:00:00',
            startDate: scheduleHistoryEvent.startDate,
            startTime: scheduleHistoryEvent.startTime,
            endDate: scheduleHistoryEvent.endDate,
            endTime: scheduleHistoryEvent.endTime,
            accessBeforeSchedule: scheduleHistoryEvent.accessBeforeSchedule,
            userTimeZone,
          },
        ];

        const latestMobileSchedule = exporter.findLatestMobileSchedule(
          '2025-03-12',
          userId,
          scheduleHistoryEvent,
          deviceHistoryData,
        );

        expect(latestMobileSchedule).toBeNull();
      });
    });
  });

  describe('daysBetweenInterval', () => {
    it('returns an array of ISO strings for each day between the start and end dates inclusive', () => {
      const days = exporter.daysBetweenInterval('2025-03-12', '2025-03-15');

      expect(days).toEqual(['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15']);
    });

    it('works for a single day', () => {
      const days = exporter.daysBetweenInterval('2025-03-12', '2025-03-12');

      expect(days).toEqual(['2025-03-12']);
    });

    it('works across months', () => {
      const days = exporter.daysBetweenInterval('2025-03-31', '2025-04-01');

      expect(days).toEqual(['2025-03-31', '2025-04-01']);
    });

    it("doesn't work backwards", () => {
      const days = exporter.daysBetweenInterval('2025-03-15', '2025-03-12');

      expect(days).toEqual([]);
    });

    it('works in forward timezones', () => {
      // GMT+2
      process.env.TZ = 'Europe/Kyiv';

      const startDateString = '2025-03-20T08:49:51';
      const endDateString = '2025-03-26T01:00:00';

      const startDate = DateTime.fromISO(startDateString, { zone: 'UTC' }).toFormat('yyyy-MM-dd');
      const endDate = DateTime.fromISO(endDateString, { zone: 'UTC' }).toFormat('yyyy-MM-dd');

      const days = exporter.daysBetweenInterval(startDate, endDate);
      expect(days).toEqual([
        '2025-03-20',
        '2025-03-21',
        '2025-03-22',
        '2025-03-23',
        '2025-03-24',
        '2025-03-25',
        '2025-03-26',
      ]);
    });

    it('works in backward timezones', () => {
      // GMT-5
      process.env.TZ = 'America/Jamaica';
      const startDateString = '2025-03-20T18:00:00';
      const endDateString = '2025-03-26T01:00:00';

      const startDate = DateTime.fromISO(startDateString, { zone: 'UTC' }).toFormat('yyyy-MM-dd');
      const endDate = DateTime.fromISO(endDateString, { zone: 'UTC' }).toFormat('yyyy-MM-dd');

      const days = exporter.daysBetweenInterval(startDate, endDate);
      expect(days).toEqual([
        '2025-03-20',
        '2025-03-21',
        '2025-03-22',
        '2025-03-23',
        '2025-03-24',
        '2025-03-25',
        '2025-03-26',
      ]);
    });

    it('does not work with invalid dates', () => {
      const days = exporter.daysBetweenInterval('2025-01-01', '2025-02-31');
      expect(days).toEqual([]);
    });
  });

  describe('generateExportData', () => {
    let respondentDataSpy: any;
    let _deviceScheduleHistoryDataSpy: any;
    let scheduleHistorySpy: any;

    beforeEach(() => {
      respondentDataSpy = vi
        .spyOn(exporter, 'getRespondentData')
        .mockResolvedValue([
          mockedOwnerParticipantWithDataAccess,
          mockedFullParticipant1WithDataAccess,
        ]);

      scheduleHistorySpy = vi.spyOn(exporter, 'getScheduleHistoryData').mockResolvedValue([]);

      _deviceScheduleHistoryDataSpy = vi
        .spyOn(exporter, 'getDeviceScheduleHistoryData')
        .mockResolvedValue([]);
    });

    describe('individual schedule participant is linked to appropriate default schedules in new applet versions', () => {
      it('when individual schedule is not deleted', async () => {
        const activityId = '5b226e57-cc94-4ea9-bcd0-456a7be322d7';
        const defaultEventId = '529318e7-e6ba-4b86-b163-3950753cf669';
        const individualEventId = 'f3dfc692-06f7-42a0-b762-24eefa6886dd';

        const scheduleHistoryData: ScheduleHistoryData[] = [
          {
            appletId: mockedAppletId,
            appletVersion: '1.1.0',
            appletName: 'Sample applet',
            userId: null,
            subjectId: null,
            eventId: defaultEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:00:00',
            eventVersionUpdatedAt: '2025-04-29T00:00:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:00:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId: mockedAppletId,
            appletVersion: '1.1.0',
            appletName: 'Sample applet',
            userId: mockedFullParticipant1WithDataAccess.id,
            subjectId: mockedFullParticipant1DetailWithDataAccess.subjectId,
            eventId: individualEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:01:00',
            eventVersionUpdatedAt: '2025-04-29T00:01:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:01:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId: mockedAppletId,
            appletVersion: '2.0.0',
            appletName: 'Applet name changed',
            userId: null,
            subjectId: null,
            eventId: defaultEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:00:00',
            eventVersionUpdatedAt: '2025-04-29T00:00:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:03:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId: mockedAppletId,
            appletVersion: '2.0.0',
            appletName: 'Applet name changed',
            userId: mockedFullParticipant1WithDataAccess.id,
            subjectId: mockedFullParticipant1DetailWithDataAccess.subjectId,
            eventId: individualEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:01:00',
            eventVersionUpdatedAt: '2025-04-29T00:01:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:03:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
        ];

        scheduleHistorySpy.mockResolvedValue(scheduleHistoryData);

        const data = await exporter.generateExportData({
          appletId: mockedAppletId,
          respondentIds: [mockedFullParticipant1WithDataAccess.id!],
          fromDate: '2025-04-29T00:00:00',
          toDate: '2025-04-29T23:59:00',
        });

        expect(data).toEqual([
          expect.objectContaining({
            applet_version: '2.0.0',
            user_id: mockedFullParticipant1WithDataAccess.id,
            schedule_id: individualEventId,
          }),
          expect.objectContaining({
            applet_version: '1.1.0',
            user_id: mockedFullParticipant1WithDataAccess.id,
            schedule_id: defaultEventId,
          }),
          expect.objectContaining({
            applet_version: '1.1.0',
            user_id: mockedFullParticipant1WithDataAccess.id,
            schedule_id: individualEventId,
          }),
        ]);
      });

      it('when individual schedule is deleted', async () => {
        const activityId = '5b226e57-cc94-4ea9-bcd0-456a7be322d7';
        const defaultEventId = '529318e7-e6ba-4b86-b163-3950753cf669';
        const individualEventId = 'f3dfc692-06f7-42a0-b762-24eefa6886dd';

        const scheduleHistoryData: ScheduleHistoryData[] = [
          {
            appletId: mockedAppletId,
            appletVersion: '1.1.0',
            appletName: 'Sample applet',
            userId: null,
            subjectId: null,
            eventId: defaultEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:00:00',
            eventVersionUpdatedAt: '2025-04-29T00:00:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:00:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId: mockedAppletId,
            appletVersion: '1.1.0',
            appletName: 'Sample applet',
            userId: mockedFullParticipant1WithDataAccess.id,
            subjectId: mockedFullParticipant1DetailWithDataAccess.subjectId,
            eventId: individualEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:01:00',
            eventVersionUpdatedAt: '2025-04-29T00:01:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:01:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId: mockedAppletId,
            appletVersion: '2.0.0',
            appletName: 'Applet name changed',
            userId: null,
            subjectId: null,
            eventId: defaultEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:00:00',
            eventVersionUpdatedAt: '2025-04-29T00:00:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:03:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId: mockedAppletId,
            appletVersion: '2.0.0',
            appletName: 'Applet name changed',
            userId: mockedFullParticipant1WithDataAccess.id,
            subjectId: mockedFullParticipant1DetailWithDataAccess.subjectId,
            eventId: individualEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:01:00',
            eventVersionUpdatedAt: '2025-04-29T00:01:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:03:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId: mockedAppletId,
            appletVersion: '2.0.1',
            appletName: 'Applet name changed again',
            userId: null,
            subjectId: null,
            eventId: defaultEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:00:00',
            eventVersionUpdatedAt: '2025-04-29T00:00:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:04:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId: mockedAppletId,
            appletVersion: '2.0.1',
            appletName: 'Applet name changed again',
            userId: mockedFullParticipant1WithDataAccess.id,
            subjectId: mockedFullParticipant1DetailWithDataAccess.subjectId,
            eventId: individualEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:01:00',
            eventVersionUpdatedAt: '2025-04-29T00:05:00',
            eventVersionIsDeleted: true,
            linkedWithAppletAt: '2025-04-29T00:04:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId: mockedAppletId,
            appletVersion: '2.0.3',
            appletName: 'Applet name changed one more time',
            userId: null,
            subjectId: null,
            eventId: defaultEventId,
            eventType: 'activity',
            eventVersion: '20250429-1',
            eventVersionCreatedAt: '2025-04-29T00:00:00',
            eventVersionUpdatedAt: '2025-04-29T00:00:00',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-29T00:06:00',
            eventUpdatedBy: mockedOwnerId,
            activityOrFlowId: activityId,
            activityOrFlowName: 'New Activity',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: false,
            periodicity: Periodicity.Always,
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            selectedDate: null,
          },
        ];

        scheduleHistorySpy.mockResolvedValue(scheduleHistoryData);

        const data = await exporter.generateExportData({
          appletId: mockedAppletId,
          respondentIds: [mockedFullParticipant1WithDataAccess.id!],
          fromDate: '2025-04-29T00:00:00',
          toDate: '2025-04-29T23:59:00',
        });

        expect(data).toEqual([
          expect.objectContaining({
            applet_version: '2.0.3',
            user_id: mockedFullParticipant1WithDataAccess.id,
            schedule_id: defaultEventId,
          }),
          expect.objectContaining({
            applet_version: '2.0.1',
            user_id: mockedFullParticipant1WithDataAccess.id,
            schedule_id: defaultEventId,
          }),
          expect.objectContaining({
            applet_version: '2.0.1',
            user_id: mockedFullParticipant1WithDataAccess.id,
            schedule_id: individualEventId,
          }),
          expect.objectContaining({
            applet_version: '2.0.0',
            user_id: mockedFullParticipant1WithDataAccess.id,
            schedule_id: individualEventId,
          }),
          expect.objectContaining({
            applet_version: '1.1.0',
            user_id: mockedFullParticipant1WithDataAccess.id,
            schedule_id: defaultEventId,
          }),
          expect.objectContaining({
            applet_version: '1.1.0',
            user_id: mockedFullParticipant1WithDataAccess.id,
            schedule_id: individualEventId,
          }),
        ]);
      });
    });

    it('default schedule take precedence after individual schedule deletion', async () => {
      const appletId = 'e5d59476-818d-43db-b9d4-33301dfb36a1';
      const flowId = '0855cfa7-8289-4ef4-bf87-ccea24be209a';
      const defaultEventId = 'e277f63a-e31c-42f3-9590-a9b1f9d25e2b';
      const individualEventId = 'a1ef64bc-62a2-448b-8d11-98968262100d';
      const respondentId = 'b32d2bbb-1bb3-4dc2-a3e7-65a9c1919046';

      const scheduleHistoryData: ScheduleHistoryData[] = [
        {
          appletId,
          appletVersion: '1.1.0',
          appletName: '1980',
          userId: null,
          subjectId: null,
          eventId: defaultEventId,
          eventType: 'flow',
          eventVersion: '20250505-1',
          eventVersionCreatedAt: '2025-05-05T10:49:12.118610',
          eventVersionUpdatedAt: '2025-05-05T10:49:12.118618',
          eventVersionIsDeleted: false,
          linkedWithAppletAt: '2025-05-05T10:49:12.122894',
          eventUpdatedBy: '36abb556-e2d3-4ce8-9390-f3fc93ee38ef',
          activityOrFlowId: flowId,
          activityOrFlowName: 'AF1',
          activityOrFlowHidden: false,
          accessBeforeSchedule: false,
          oneTimeCompletion: false,
          periodicity: Periodicity.Always,
          startDate: null,
          startTime: '00:00:00',
          endDate: null,
          endTime: '23:59:00',
          selectedDate: null,
        },
        {
          appletId,
          appletVersion: '1.1.0',
          appletName: '1980',
          userId: respondentId,
          subjectId: '6db858b0-0cbd-4b8c-a132-ed8aaef870e2',
          eventId: individualEventId,
          eventType: 'flow',
          eventVersion: '20250505-1',
          eventVersionCreatedAt: '2025-05-05T10:57:58.128417',
          eventVersionUpdatedAt: '2025-05-05T10:57:58.128423',
          eventVersionIsDeleted: false,
          linkedWithAppletAt: '2025-05-05T10:57:58.134459',
          eventUpdatedBy: '36abb556-e2d3-4ce8-9390-f3fc93ee38ef',
          activityOrFlowId: flowId,
          activityOrFlowName: 'AF1',
          activityOrFlowHidden: false,
          accessBeforeSchedule: false,
          oneTimeCompletion: false,
          periodicity: Periodicity.Always,
          startDate: null,
          startTime: '00:00:00',
          endDate: null,
          endTime: '23:59:00',
          selectedDate: null,
        },
        {
          appletId,
          appletVersion: '1.1.0',
          appletName: '1980',
          userId: respondentId,
          subjectId: '6db858b0-0cbd-4b8c-a132-ed8aaef870e2',
          eventId: individualEventId,
          eventType: 'flow',
          eventVersion: '20250505-2',
          eventVersionCreatedAt: '2025-05-05T11:00:08.441623',
          eventVersionUpdatedAt: '2025-05-06T10:31:19.303004',
          eventVersionIsDeleted: true,
          linkedWithAppletAt: '2025-05-05T11:00:08.448098',
          eventUpdatedBy: '36abb556-e2d3-4ce8-9390-f3fc93ee38ef',
          activityOrFlowId: flowId,
          activityOrFlowName: 'AF1',
          activityOrFlowHidden: false,
          accessBeforeSchedule: false,
          oneTimeCompletion: null,
          periodicity: Periodicity.Daily,
          startDate: '2025-05-05',
          startTime: '07:00:00',
          endDate: '2025-05-19',
          endTime: '11:00:00',
          selectedDate: null,
        },
      ];
      scheduleHistorySpy.mockResolvedValue(scheduleHistoryData);

      const respondentData: ParticipantWithDataAccess[] = [
        {
          id: respondentId,
          nicknames: ['NN-PRNT'],
          secretIds: ['ID-PRNT'],
          isAnonymousRespondent: false,
          lastSeen: null,
          isPinned: false,
          details: [
            {
              appletId,
              appletDisplayName: '1980',
              appletImage: '',
              accessId: '961e6507-30d0-4b36-b8da-6023b92d7532',
              respondentNickname: 'NN-PRNT',
              respondentSecretId: 'ID-PRNT',
              hasIndividualSchedule: false,
              encryption: {
                publicKey:
                  '[1,76,211,152,171,81,215,33,212,194,212,245,49,115,35,8,67,179,133,181,175,30,204,169,67,183,69,200,29,166,232,116,226,227,195,60,105,93,212,165,47,145,236,83,38,14,26,2,136,108,206,247,232,13,235,70,128,4,198,13,118,194,115,68,104,119,168,15,204,218,249,100,56,128,221,72,119,145,186,251,170,241,92,246,28,79,234,169,78,248,178,218,120,205,214,72,229,66,31,37,163,107,250,121,131,10,196,21,104,248,3,137,84,175,52,74,60,36,239,150,71,225,69,94,180,149,131,109]',
                prime:
                  '[142,53,84,26,33,215,174,82,178,158,65,41,36,152,127,139,197,84,90,109,103,78,94,198,149,47,225,230,115,130,194,200,81,168,101,114,98,61,177,75,5,177,145,221,227,162,65,164,108,175,141,135,195,231,15,60,128,194,133,208,69,128,254,215,114,154,198,158,109,213,187,214,158,249,206,122,105,179,103,3,182,125,47,178,49,40,174,108,200,234,147,92,166,82,149,188,194,204,56,232,83,74,155,128,101,255,174,173,116,143,235,160,156,12,125,136,25,12,107,22,160,16,138,212,164,236,224,235]',
                base: '[2]',
                accountId: '36abb556-e2d3-4ce8-9390-f3fc93ee38ef',
              },
              subjectId: '6db858b0-0cbd-4b8c-a132-ed8aaef870e2',
              subjectTag: 'Parent',
              subjectFirstName: 'FN-PRNT',
              subjectLastName: 'LN-PRNT',
              subjectCreatedAt: '2025-05-05T10:55:25.701196',
              subjectUpdatedAt: '2025-05-05T10:55:25.701196',
              subjectIsDeleted: false,
              invitation: {
                email: 'someone1@example.com',
                appletId,
                appletName: '1980',
                role: 'respondent',
                key: '9a455418-b9b8-3ba6-aadd-d363f3bbf511',
                status: 'approved',
                firstName: 'FN-PRNT',
                lastName: 'LN-PRNT',
                createdAt: '2025-05-05T10:55:25.760007',
                acceptedAt: '2025-05-05T10:55:50.148171',
                meta: { subject_id: '6db858b0-0cbd-4b8c-a132-ed8aaef870e2', secret_user_id: null },
                nickname: 'NN-PRNT',
                secretUserId: 'ID-PRNT',
                tag: 'Parent',
                title: null,
              },
              roles: [Roles.Respondent],
              teamMemberCanViewData: true,
            },
          ],
          status: ParticipantStatus.Invited,
          email: 'someone1@example.com',
          subjects: ['6db858b0-0cbd-4b8c-a132-ed8aaef870e2'],
        },
        {
          id: '36abb556-e2d3-4ce8-9390-f3fc93ee38ef',
          nicknames: ['Aki Q'],
          secretIds: ['11ab8179-7b6c-4467-bb27-5330cfaab4bf'],
          isAnonymousRespondent: false,
          lastSeen: null,
          isPinned: false,
          details: [
            {
              appletId,
              appletDisplayName: '1980',
              appletImage: '',
              accessId: 'b83071ad-9c51-4d62-be27-fbccbce36807',
              respondentNickname: 'Aki Q',
              respondentSecretId: '11ab8179-7b6c-4467-bb27-5330cfaab4bf',
              hasIndividualSchedule: false,
              encryption: {
                publicKey:
                  '[1,76,211,152,171,81,215,33,212,194,212,245,49,115,35,8,67,179,133,181,175,30,204,169,67,183,69,200,29,166,232,116,226,227,195,60,105,93,212,165,47,145,236,83,38,14,26,2,136,108,206,247,232,13,235,70,128,4,198,13,118,194,115,68,104,119,168,15,204,218,249,100,56,128,221,72,119,145,186,251,170,241,92,246,28,79,234,169,78,248,178,218,120,205,214,72,229,66,31,37,163,107,250,121,131,10,196,21,104,248,3,137,84,175,52,74,60,36,239,150,71,225,69,94,180,149,131,109]',
                prime:
                  '[142,53,84,26,33,215,174,82,178,158,65,41,36,152,127,139,197,84,90,109,103,78,94,198,149,47,225,230,115,130,194,200,81,168,101,114,98,61,177,75,5,177,145,221,227,162,65,164,108,175,141,135,195,231,15,60,128,194,133,208,69,128,254,215,114,154,198,158,109,213,187,214,158,249,206,122,105,179,103,3,182,125,47,178,49,40,174,108,200,234,147,92,166,82,149,188,194,204,56,232,83,74,155,128,101,255,174,173,116,143,235,160,156,12,125,136,25,12,107,22,160,16,138,212,164,236,224,235]',
                base: '[2]',
                accountId: '36abb556-e2d3-4ce8-9390-f3fc93ee38ef',
              },
              subjectId: '85bb50d2-ed90-413d-9736-9b3d0e706627',
              subjectTag: 'Team',
              subjectFirstName: 'Aki',
              subjectLastName: 'Q',
              subjectCreatedAt: '2025-05-05T10:49:11.696467',
              subjectUpdatedAt: '2025-05-05T10:49:11.696467',
              subjectIsDeleted: false,
              invitation: null,
              roles: [Roles.Owner, Roles.Respondent],
              teamMemberCanViewData: true,
            },
          ],
          status: ParticipantStatus.Invited,
          email: 'someone2@example.com',
          subjects: ['85bb50d2-ed90-413d-9736-9b3d0e706627'],
        },
      ];
      respondentDataSpy.mockResolvedValue(respondentData);

      // Both schedules appear on deletion day
      let data = await exporter.generateExportData({
        appletId,
        respondentIds: [respondentId],
        activityOrFlowIds: [flowId],
        fromDate: '2025-05-06T00:00:00',
        toDate: '2025-05-06T23:59:00',
      });

      expect(data).toEqual([
        expect.objectContaining({
          applet_version: '1.1.0',
          schedule_id: defaultEventId,
          schedule_version: '20250505-1',
          schedule_date: '2025-05-06',
        }),
        expect.objectContaining({
          applet_version: '1.1.0',
          schedule_id: individualEventId,
          schedule_version: '20250505-2',
          schedule_date: '2025-05-06',
        }),
      ]);

      // Only default schedule appears after deletion day
      data = await exporter.generateExportData({
        appletId,
        respondentIds: [respondentId],
        activityOrFlowIds: [flowId],
        fromDate: '2025-05-07T00:00:00',
        toDate: '2025-05-07T23:59:00',
      });

      expect(data).toEqual([
        expect.objectContaining({
          applet_version: '1.1.0',
          schedule_id: defaultEventId,
          schedule_version: '20250505-1',
          schedule_date: '2025-05-07',
        }),
      ]);
    });

    it('exports data for soft deleted subjects', async () => {
      const appletId = 'e5d59476-818d-43db-b9d4-33301dfb36a1';
      const flowId = '0855cfa7-8289-4ef4-bf87-ccea24be209a';
      const defaultEventId = 'e277f63a-e31c-42f3-9590-a9b1f9d25e2b';
      const respondentId = 'b32d2bbb-1bb3-4dc2-a3e7-65a9c1919046';
      const ownerId = '36abb556-e2d3-4ce8-9390-f3fc93ee38ef';

      const scheduleHistoryData: ScheduleHistoryData[] = [
        {
          appletId,
          appletVersion: '1.1.0',
          appletName: '1980',
          userId: null,
          subjectId: null,
          eventId: defaultEventId,
          eventType: 'flow',
          eventVersion: '20250505-1',
          eventVersionCreatedAt: '2025-05-05T10:49:12.118610',
          eventVersionUpdatedAt: '2025-05-05T10:49:12.118618',
          eventVersionIsDeleted: false,
          linkedWithAppletAt: '2025-05-05T10:49:12.122894',
          eventUpdatedBy: '36abb556-e2d3-4ce8-9390-f3fc93ee38ef',
          activityOrFlowId: flowId,
          activityOrFlowName: 'AF1',
          activityOrFlowHidden: false,
          accessBeforeSchedule: false,
          oneTimeCompletion: false,
          periodicity: Periodicity.Always,
          startDate: null,
          startTime: '00:00:00',
          endDate: null,
          endTime: '23:59:00',
          selectedDate: null,
        },
      ];
      scheduleHistorySpy.mockResolvedValue(scheduleHistoryData);

      const respondentData: ParticipantWithDataAccess[] = [
        {
          id: respondentId,
          nicknames: ['participant'],
          secretIds: ['participant'],
          isAnonymousRespondent: false,
          lastSeen: null,
          isPinned: false,
          details: [
            {
              appletId,
              appletDisplayName: '1980',
              appletImage: '',
              accessId: '961e6507-30d0-4b36-b8da-6023b92d7532',
              respondentNickname: 'participant',
              respondentSecretId: 'participant',
              hasIndividualSchedule: false,
              encryption: {
                publicKey:
                  '[1,76,211,152,171,81,215,33,212,194,212,245,49,115,35,8,67,179,133,181,175,30,204,169,67,183,69,200,29,166,232,116,226,227,195,60,105,93,212,165,47,145,236,83,38,14,26,2,136,108,206,247,232,13,235,70,128,4,198,13,118,194,115,68,104,119,168,15,204,218,249,100,56,128,221,72,119,145,186,251,170,241,92,246,28,79,234,169,78,248,178,218,120,205,214,72,229,66,31,37,163,107,250,121,131,10,196,21,104,248,3,137,84,175,52,74,60,36,239,150,71,225,69,94,180,149,131,109]',
                prime:
                  '[142,53,84,26,33,215,174,82,178,158,65,41,36,152,127,139,197,84,90,109,103,78,94,198,149,47,225,230,115,130,194,200,81,168,101,114,98,61,177,75,5,177,145,221,227,162,65,164,108,175,141,135,195,231,15,60,128,194,133,208,69,128,254,215,114,154,198,158,109,213,187,214,158,249,206,122,105,179,103,3,182,125,47,178,49,40,174,108,200,234,147,92,166,82,149,188,194,204,56,232,83,74,155,128,101,255,174,173,116,143,235,160,156,12,125,136,25,12,107,22,160,16,138,212,164,236,224,235]',
                base: '[2]',
                accountId: '36abb556-e2d3-4ce8-9390-f3fc93ee38ef',
              },
              subjectId: '6db858b0-0cbd-4b8c-a132-ed8aaef870e2',
              subjectTag: 'Parent',
              subjectFirstName: 'FN-PRNT',
              subjectLastName: 'LN-PRNT',
              subjectCreatedAt: '2025-05-05T10:55:25.701196',
              subjectUpdatedAt: '2025-05-10T10:55:25.701196',
              subjectIsDeleted: true,
              invitation: {
                email: 'someone1@example.com',
                appletId,
                appletName: '1980',
                role: 'respondent',
                key: '9a455418-b9b8-3ba6-aadd-d363f3bbf511',
                status: 'approved',
                firstName: 'FN-PRNT',
                lastName: 'LN-PRNT',
                createdAt: '2025-05-05T10:55:25.760007',
                acceptedAt: '2025-05-05T10:55:50.148171',
                meta: { subject_id: '6db858b0-0cbd-4b8c-a132-ed8aaef870e2', secret_user_id: null },
                nickname: 'participant',
                secretUserId: 'participant',
                tag: 'Parent',
                title: null,
              },
              roles: [Roles.Respondent],
              teamMemberCanViewData: true,
            },
          ],
          status: ParticipantStatus.Invited,
          email: 'someone1@example.com',
          subjects: ['6db858b0-0cbd-4b8c-a132-ed8aaef870e2'],
        },
        {
          id: ownerId,
          nicknames: ['owner'],
          secretIds: ['11ab8179-7b6c-4467-bb27-5330cfaab4bf'],
          isAnonymousRespondent: false,
          lastSeen: null,
          isPinned: false,
          details: [
            {
              appletId,
              appletDisplayName: '1980',
              appletImage: '',
              accessId: 'b83071ad-9c51-4d62-be27-fbccbce36807',
              respondentNickname: 'owner',
              respondentSecretId: '11ab8179-7b6c-4467-bb27-5330cfaab4bf',
              hasIndividualSchedule: false,
              encryption: {
                publicKey:
                  '[1,76,211,152,171,81,215,33,212,194,212,245,49,115,35,8,67,179,133,181,175,30,204,169,67,183,69,200,29,166,232,116,226,227,195,60,105,93,212,165,47,145,236,83,38,14,26,2,136,108,206,247,232,13,235,70,128,4,198,13,118,194,115,68,104,119,168,15,204,218,249,100,56,128,221,72,119,145,186,251,170,241,92,246,28,79,234,169,78,248,178,218,120,205,214,72,229,66,31,37,163,107,250,121,131,10,196,21,104,248,3,137,84,175,52,74,60,36,239,150,71,225,69,94,180,149,131,109]',
                prime:
                  '[142,53,84,26,33,215,174,82,178,158,65,41,36,152,127,139,197,84,90,109,103,78,94,198,149,47,225,230,115,130,194,200,81,168,101,114,98,61,177,75,5,177,145,221,227,162,65,164,108,175,141,135,195,231,15,60,128,194,133,208,69,128,254,215,114,154,198,158,109,213,187,214,158,249,206,122,105,179,103,3,182,125,47,178,49,40,174,108,200,234,147,92,166,82,149,188,194,204,56,232,83,74,155,128,101,255,174,173,116,143,235,160,156,12,125,136,25,12,107,22,160,16,138,212,164,236,224,235]',
                base: '[2]',
                accountId: '36abb556-e2d3-4ce8-9390-f3fc93ee38ef',
              },
              subjectId: '85bb50d2-ed90-413d-9736-9b3d0e706627',
              subjectTag: 'Team',
              subjectFirstName: 'Aki',
              subjectLastName: 'Q',
              subjectCreatedAt: '2025-05-05T10:49:11.696467',
              subjectUpdatedAt: '2025-05-05T10:49:11.696467',
              subjectIsDeleted: false,
              invitation: null,
              roles: [Roles.Owner, Roles.Respondent],
              teamMemberCanViewData: true,
            },
          ],
          status: ParticipantStatus.Invited,
          email: 'someone2@example.com',
          subjects: ['85bb50d2-ed90-413d-9736-9b3d0e706627'],
        },
      ];
      respondentDataSpy.mockResolvedValue(respondentData);

      // Data is preserved for dates before deletion
      let data = await exporter.generateExportData({
        appletId,
        respondentIds: [respondentId],
        activityOrFlowIds: [flowId],
        fromDate: '2025-05-07T00:00:00',
        toDate: '2025-05-07T23:59:00',
      });

      expect(data).toEqual([
        expect.objectContaining({
          applet_version: '1.1.0',
          schedule_id: defaultEventId,
          schedule_version: '20250505-1',
          schedule_date: '2025-05-07',
          user_id: respondentId,
        }),
      ]);

      // No data is present for days after deletion
      // Data is preserved for dates before deletion
      data = await exporter.generateExportData({
        appletId,
        respondentIds: [respondentId],
        activityOrFlowIds: [flowId],
        fromDate: '2025-05-11T00:00:00',
        toDate: '2025-05-11T23:59:00',
      });

      expect(data).toEqual([]);
    });
  });
});
