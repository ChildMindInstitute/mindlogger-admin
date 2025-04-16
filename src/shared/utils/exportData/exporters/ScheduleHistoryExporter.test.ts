import { DateTime } from 'luxon';

import { Periodicity, ScheduleHistoryData } from 'modules/Dashboard/api';
import { ScheduleHistoryExporter } from 'shared/utils/exportData/exporters/ScheduleHistoryExporter';
import { groupBy } from 'shared/utils/array';

describe('ScheduleHistoryExporter', () => {
  const exporter = new ScheduleHistoryExporter('owner-id');

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
          describe('ALWAYS', () => {
            describe('deleted before start time', () => {
              it('deleted before default schedule end time', () => {
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

                // Individual schedule applies until it is deleted
                ['2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach(
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
                        periodicity: Periodicity.Always,
                      }),
                    ]);
                  },
                );

                // Default schedule applies again thereafter
                exporter.daysBetweenInterval('2025-03-20', '2035-03-20').forEach((day) => {
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

              it('deleted after default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-20T07:30:00',
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

                // Individual schedule applies until it is deleted
                ['2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach(
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
                        periodicity: Periodicity.Always,
                      }),
                    ]);
                  },
                );

                // Nothing applies on deletion day because the individual schedule was deleted after the default
                // schedule end time, and before its own start time
                const foundSchedules = exporter.findSchedulesForDay(
                  '2025-03-20',
                  individualScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([]);

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
            });

            describe('deleted after start time', () => {
              it('deleted before default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-20T08:30:00',
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

                // Individual schedule applies until it is deleted
                ['2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach(
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
                        periodicity: Periodicity.Always,
                      }),
                    ]);
                  },
                );

                // Both schedules apply on the 20th
                const foundSchedules = exporter.findSchedulesForDay(
                  '2025-03-20',
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

              it('deleted after default schedule end time', () => {
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
                    endTime: '07:00:00',
                    selectedDate: null,
                  }),
                  scheduleData({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    userId: individualScheduleUser,
                    subjectId: individualScheduleUserSubject,
                    eventVersionCreatedAt: '2025-03-15T00:00:00',
                    eventVersionUpdatedAt: '2025-03-20T08:30:00',
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

                // Individual schedule applies until it is deleted, including on deletion day
                [
                  '2025-03-15',
                  '2025-03-16',
                  '2025-03-17',
                  '2025-03-18',
                  '2025-03-19',
                  '2025-03-20',
                ].forEach((day) => {
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
            });
          });

          describe('ONCE', () => {
            it('deleted before default schedule end time', () => {
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
                  eventVersionUpdatedAt: '2025-03-16T00:00:00',
                  eventVersionIsDeleted: true,
                  periodicity: Periodicity.Once,
                  startDate: null,
                  startTime: '08:00:00',
                  endDate: null,
                  endTime: '09:00:00',
                  selectedDate: '2025-03-15',
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

              // Individual schedule applies on the selected date
              const foundSchedules = exporter.findSchedulesForDay(
                '2025-03-15',
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

              // Default schedule applies after the selected date, including on the 16th because the individual
              // schedule event was deleted before the default schedule event's end time
              exporter.daysBetweenInterval('2025-03-16', '2035-03-16').forEach((day) => {
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

            it('deleted after default schedule end time', () => {
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
                  eventVersionUpdatedAt: '2025-03-16T09:30:00',
                  eventVersionIsDeleted: true,
                  periodicity: Periodicity.Once,
                  startDate: null,
                  startTime: '08:00:00',
                  endDate: null,
                  endTime: '09:00:00',
                  selectedDate: '2025-03-15',
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

              // Individual schedule applies on the selected date
              let foundSchedules = exporter.findSchedulesForDay(
                '2025-03-15',
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

              // Nothing applies on the deletion date (16th), since the periodicity is ONCE, and it was deleted
              // after the default schedule event's end time
              foundSchedules = exporter.findSchedulesForDay(
                '2025-03-16',
                individualScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([]);

              // Default schedule applies after the selected date because the individual schedule event
              // was deleted before its start time
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
          });

          describe('DAILY', () => {
            describe('deleted before start time', () => {
              it('deleted before default schedule end time', () => {
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

                // Individual schedule applies until deleted
                ['2025-03-15', '2025-03-16', '2025-03-17'].forEach((day) => {
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

                // Default schedule applies on the deletion date and afterwards
                exporter.daysBetweenInterval('2025-03-18', '2035-03-18').forEach((day) => {
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

              it('deleted after default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-18T07:30:00',
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

                // Individual schedule applies until deleted
                ['2025-03-15', '2025-03-16', '2025-03-17'].forEach((day) => {
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

                // Nothing applies on the 18th because the individual schedule event was deleted after what would have
                // been the end of the default schedule event
                const foundSchedules = exporter.findSchedulesForDay(
                  '2025-03-18',
                  individualScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([]);

                // Default schedule applies after the deletion date
                exporter.daysBetweenInterval('2025-03-19', '2035-03-19').forEach((day) => {
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

            describe('deleted after start time', () => {
              it('deleted before default schedule end time', () => {
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
                    endTime: '11:00:00',
                    selectedDate: null,
                  }),
                  scheduleData({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    userId: individualScheduleUser,
                    subjectId: individualScheduleUserSubject,
                    eventVersionCreatedAt: '2025-03-15T00:00:00',
                    eventVersionUpdatedAt: '2025-03-18T08:30:00',
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

                // Individual schedule applies until deleted
                ['2025-03-15', '2025-03-16', '2025-03-17'].forEach((day) => {
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

                // Both schedules apply on the deletion date
                const foundSchedules = exporter.findSchedulesForDay(
                  '2025-03-18',
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

                // Default schedule applies after the deletion date
                exporter.daysBetweenInterval('2025-03-19', '2035-03-19').forEach((day) => {
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

              it('deleted after default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-18T08:30:00',
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

                // Individual schedule applies until deleted, including deletion day
                ['2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18'].forEach((day) => {
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

                // Default schedule applies after the deletion date
                exporter.daysBetweenInterval('2025-03-19', '2035-03-19').forEach((day) => {
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
          });

          describe('WEEKLY', () => {
            describe('deleted before start time', () => {
              it('deleted before default schedule end time', () => {
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

                const applicableDays = ['2025-03-20'];

                // Individual schedule applies until deleted
                exporter.daysBetweenInterval('2025-03-15', '2025-03-26').forEach((day) => {
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

              it('deleted after default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-27T07:30:00',
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

                const applicableDays = ['2025-03-20'];

                // Individual schedule applies until deleted
                exporter.daysBetweenInterval('2025-03-15', '2025-03-26').forEach((day) => {
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

                // Nothing applies on the deletion date
                const foundSchedules = exporter.findSchedulesForDay(
                  '2025-03-27',
                  individualScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([]);

                // Default schedule applies after deletion date
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
            });

            describe('deleted after start time', () => {
              it('deleted before default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-27T08:30:00',
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

                const applicableDays = ['2025-03-20'];

                // Individual schedule applies until deleted
                exporter.daysBetweenInterval('2025-03-15', '2025-03-26').forEach((day) => {
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

                // Both schedules apply on the deletion date
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

                // Default schedule applies after the deletion date
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

              it('deleted after default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-27T08:30:00',
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

                const applicableDays = ['2025-03-20'];

                // Individual schedule applies until deleted
                exporter.daysBetweenInterval('2025-03-15', '2025-03-26').forEach((day) => {
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

                // Individual schedule applies on the deletion date
                const foundSchedules = exporter.findSchedulesForDay(
                  '2025-03-27',
                  individualScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([
                  expect.objectContaining({
                    eventId: 'individual-schedule-event-1',
                    eventVersion: 'v1',
                    periodicity: Periodicity.Weekly,
                  }),
                ]);

                // Default schedule applies after deletion date
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
            });
          });

          describe('WEEKDAYS', () => {
            describe('deleted before start time', () => {
              it('deleted before default schedule end time', () => {
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

                // Individual schedule applies until end date
                exporter.daysBetweenInterval('2025-03-15', '2025-03-26').forEach((day) => {
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

              it('deleted after default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-27T07:30:00',
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

                // Individual schedule applies until end date
                exporter.daysBetweenInterval('2025-03-15', '2025-03-26').forEach((day) => {
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

                // Nothing applies until the individual schedule deletion date (including on that date)
                exporter.daysBetweenInterval('2025-03-21', '2025-03-27').forEach((day) => {
                  const foundSchedules = exporter.findSchedulesForDay(
                    day,
                    individualScheduleUser,
                    scheduleHistoryData,
                  );

                  expect(foundSchedules).toEqual([]);
                });

                // Default schedule applies on the deletion date and afterwards
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
            });

            describe('deleted after start time', () => {
              it('deleted before default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-20T08:30:00',
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

                const applicableDays = ['2025-03-17', '2025-03-18', '2025-03-19'];

                // Individual schedule applies until deletion date
                exporter.daysBetweenInterval('2025-03-15', '2025-03-19').forEach((day) => {
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

                // Both schedules apply on the deletion date
                const foundSchedules = exporter.findSchedulesForDay(
                  '2025-03-20',
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
                    periodicity: Periodicity.Weekdays,
                  }),
                ]);

                // Default schedule applies after the deletion date
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

              it('deleted after default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-03-20T08:30:00',
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

                // Individual schedule applies until deletion date (including the date itself)
                exporter.daysBetweenInterval('2025-03-15', '2025-03-20').forEach((day) => {
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

                // Default schedule applies after the deletion date
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
            });
          });

          describe('MONTHLY', () => {
            describe('deleted before start time', () => {
              it('deleted before default schedule end time', () => {
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

                // Nothing applies until the start date
                exporter.daysBetweenInterval('2025-03-15', '2025-04-30').forEach((day) => {
                  const foundSchedules = exporter.findSchedulesForDay(
                    day,
                    individualScheduleUser,
                    scheduleHistoryData,
                  );

                  expect(foundSchedules).toEqual([]);
                });

                const applicableDays = ['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01'];

                // Individual schedule applies until deleted
                exporter.daysBetweenInterval('2025-03-15', '2025-08-09').forEach((day) => {
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

              it('deleted after default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-08-10T07:30:00',
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

                // Nothing applies until the start date
                exporter.daysBetweenInterval('2025-03-15', '2025-04-30').forEach((day) => {
                  const foundSchedules = exporter.findSchedulesForDay(
                    day,
                    individualScheduleUser,
                    scheduleHistoryData,
                  );

                  expect(foundSchedules).toEqual([]);
                });

                const applicableDays = ['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01'];

                // Individual schedule applies until deleted
                exporter.daysBetweenInterval('2025-03-15', '2025-08-09').forEach((day) => {
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

                // Nothing applies on the deletion date
                const foundSchedules = exporter.findSchedulesForDay(
                  '2025-08-10',
                  individualScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([]);

                // Default schedule applies on the deletion date and afterwards
                exporter.daysBetweenInterval('2025-08-11', '2035-08-11').forEach((day) => {
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

            describe('deleted after start time', () => {
              it('deleted before default schedule end time', () => {
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
                    startTime: '07:00:00',
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
                    eventVersionUpdatedAt: '2025-08-10T08:30:00',
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

                // Nothing applies until the start date
                exporter.daysBetweenInterval('2025-03-15', '2025-04-30').forEach((day) => {
                  const foundSchedules = exporter.findSchedulesForDay(
                    day,
                    individualScheduleUser,
                    scheduleHistoryData,
                  );

                  expect(foundSchedules).toEqual([]);
                });

                const applicableDays = ['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01'];

                // Individual schedule applies until deleted
                exporter.daysBetweenInterval('2025-03-15', '2025-08-09').forEach((day) => {
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

              it('deleted after default schedule end time', () => {
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
                    eventVersionUpdatedAt: '2025-08-10T08:30:00',
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

                // Nothing applies until the start date
                exporter.daysBetweenInterval('2025-03-15', '2025-04-30').forEach((day) => {
                  const foundSchedules = exporter.findSchedulesForDay(
                    day,
                    individualScheduleUser,
                    scheduleHistoryData,
                  );

                  expect(foundSchedules).toEqual([]);
                });

                const applicableDays = ['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01'];

                // Individual schedule applies until deleted
                exporter.daysBetweenInterval('2025-03-15', '2025-08-09').forEach((day) => {
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

                // Nothing applies on the deletion date
                const foundSchedules = exporter.findSchedulesForDay(
                  '2025-08-10',
                  individualScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([]);

                // Default schedule applies on the deletion date and afterwards
                exporter.daysBetweenInterval('2025-08-11', '2035-08-11').forEach((day) => {
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

            // v2 applies after
            exporter.daysBetweenInterval('2025-03-15', '2035-03-15').forEach((day) => {
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

            // v2 applies on the selected date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
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

            // v2 applies after
            ['2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach(
              (day) => {
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
              },
            );

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

            // Nothing applies until the start date of v2
            ['2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach(
              (day) => {
                const foundSchedules = exporter.findSchedulesForDay(
                  day,
                  defaultScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([]);
              },
            );

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

            // v2 applies after
            const applicableDays = ['2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20'];
            exporter.daysBetweenInterval('2025-03-15', '2025-03-20').forEach((day) => {
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

            // Nothing applies until the start date of v2
            exporter.daysBetweenInterval('2025-03-15', '2025-04-30').forEach((day) => {
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

            // schedule 2 applies after
            exporter.daysBetweenInterval('2025-03-15', '2035-03-15').forEach((day) => {
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

            // schedule 2 applies on the selected date
            const foundSchedules = exporter.findSchedulesForDay(
              '2025-03-15',
              defaultScheduleUser,
              scheduleHistoryData,
            );

            expect(foundSchedules).toEqual([
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

            // schedule 2 applies after
            ['2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach(
              (day) => {
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
              },
            );

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

            // Nothing applies until the start date of schedule 2
            ['2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach(
              (day) => {
                const foundSchedules = exporter.findSchedulesForDay(
                  day,
                  defaultScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([]);
              },
            );

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

            // schedule 2 applies after
            const applicableDays = ['2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20'];
            exporter.daysBetweenInterval('2025-03-15', '2025-03-20').forEach((day) => {
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

            // Nothing applies until the start date of schedule 2
            exporter.daysBetweenInterval('2025-03-15', '2025-04-30').forEach((day) => {
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
          );

          // Default schedule event 2 should not be present for the individual schedule user
          const foundSchedules = exporter.findSchedulesForDay(
            '2025-03-12',
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

          // v2 shows up on the days after it was created
          ['2025-12-30', '2025-12-31'].forEach((day) => {
            // Schedule does not apply before creation date
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

          applicableDays = [
            '2025-01-10',
            '2025-01-13',
            '2025-01-14',
            '2025-01-15',
            '2025-01-16',
            '2025-01-17',
          ];

          exporter.daysBetweenInterval('2025-01-10', '2025-01-17').forEach((day) => {
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

          applicableDays = ['2025-03-03', '2025-04-03'];

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
    it(
      'M2-8993: Only the updated event is present in the schedule_history after updating the event and downloading ' +
        'export the next day',
      async () => {
        const appletId = '39fb6561-436b-4b43-a736-c5e2bf93ed0d';
        const eventId = 'a8512d9a-6441-4157-8f75-7b9fa58b8159';
        const activityOrFlowId = 'fa9080b6-0f3b-445b-8041-16ba95391862';

        const mockScheduleHistoryData: ScheduleHistoryData[] = [
          {
            appletId,
            appletVersion: '1.1.0',
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: 'd41a1967-d835-4285-9b1c-cffb8cffe952',
            eventType: 'activity',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:29:32.444811',
            eventVersionUpdatedAt: '2025-04-01T17:29:32.444817',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:29:32.452688',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: '8abb3094-e3fb-461d-9b2b-c9b70ceaa4cb',
            activityOrFlowName: 'New Activity 01',
            activityOrFlowHidden: true,
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
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: 'c03b3bc2-6161-4615-8163-a6a9c158158e',
            eventType: 'activity',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:29:32.480328',
            eventVersionUpdatedAt: '2025-04-01T17:29:32.480335',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:29:32.483933',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: '258a5f1b-93c7-4448-9217-847bafdb10eb',
            activityOrFlowName: 'New Activity 02',
            activityOrFlowHidden: true,
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
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: '67e59be4-7ded-46d5-b847-e2d793d4d14c',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:29:32.571474',
            eventVersionUpdatedAt: '2025-04-01T17:44:54.693493',
            eventVersionIsDeleted: true,
            linkedWithAppletAt: '2025-04-01T17:29:32.574864',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId,
            activityOrFlowName: 'AF01',
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
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: 'b1ca41d9-6080-4dcf-bc47-527838ea0fca',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:29:32.601941',
            eventVersionUpdatedAt: '2025-04-01T17:46:08.869392',
            eventVersionIsDeleted: true,
            linkedWithAppletAt: '2025-04-01T17:29:32.605718',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: 'dfda3519-ec02-48c1-a333-ba5401cbffd4',
            activityOrFlowName: 'AF02',
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
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: '7e65afe6-7d31-463e-91bb-52fdc0406dbd',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:29:32.628470',
            eventVersionUpdatedAt: '2025-04-01T17:46:55.942558',
            eventVersionIsDeleted: true,
            linkedWithAppletAt: '2025-04-01T17:29:32.632342',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: 'c990fee0-0400-45de-ada8-8ea79b4034f4',
            activityOrFlowName: 'AF03',
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
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: 'd4761f81-461a-4d39-b4f9-7b8417d37414',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:29:32.654316',
            eventVersionUpdatedAt: '2025-04-01T17:47:29.842945',
            eventVersionIsDeleted: true,
            linkedWithAppletAt: '2025-04-01T17:29:32.657191',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: 'af1c2236-2b84-4e15-89d8-2654508db925',
            activityOrFlowName: 'AF04',
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
            appletName: 'NIMH 01',
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            subjectId: '396d9ba8-090a-48bc-a772-e89361f90740',
            eventId: '685dff7e-3372-495a-8b3d-92eb35241ddb',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:43:32.541160',
            eventVersionUpdatedAt: '2025-04-01T17:43:32.541166',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:43:32.552034',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId,
            activityOrFlowName: 'AF01',
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
            appletName: 'NIMH 01',
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            subjectId: '396d9ba8-090a-48bc-a772-e89361f90740',
            eventId: '7481a981-3ecc-449e-b2d5-4da13eb536fc',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:43:32.579683',
            eventVersionUpdatedAt: '2025-04-01T17:43:32.579690',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:43:32.583249',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: 'dfda3519-ec02-48c1-a333-ba5401cbffd4',
            activityOrFlowName: 'AF02',
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
            appletName: 'NIMH 01',
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            subjectId: '396d9ba8-090a-48bc-a772-e89361f90740',
            eventId: '9fd81b2c-0bf1-444f-ba94-a1e08cf68784',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:43:32.607941',
            eventVersionUpdatedAt: '2025-04-01T17:43:32.607947',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:43:32.611943',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: 'c990fee0-0400-45de-ada8-8ea79b4034f4',
            activityOrFlowName: 'AF03',
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
            appletName: 'NIMH 01',
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            subjectId: '396d9ba8-090a-48bc-a772-e89361f90740',
            eventId: '19dc6500-bb2d-4f23-95bc-b2463e86c5e0',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:43:32.637322',
            eventVersionUpdatedAt: '2025-04-01T17:43:32.637328',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:43:32.640809',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: 'af1c2236-2b84-4e15-89d8-2654508db925',
            activityOrFlowName: 'AF04',
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
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: 'a8512d9a-6441-4157-8f75-7b9fa58b8159',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:44:54.747666',
            eventVersionUpdatedAt: '2025-04-01T17:44:54.747672',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:44:54.755593',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId,
            activityOrFlowName: 'AF01',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: null,
            periodicity: Periodicity.Daily,
            startDate: '2025-04-01',
            startTime: '07:00:00',
            endDate: '2025-04-15',
            endTime: '11:00:00',
            selectedDate: null,
          },
          {
            appletId,
            appletVersion: '1.1.0',
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: '0bc02535-a994-4719-897a-a3d58ba54ba2',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:46:08.899777',
            eventVersionUpdatedAt: '2025-04-01T17:46:08.899782',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:46:08.907421',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: 'dfda3519-ec02-48c1-a333-ba5401cbffd4',
            activityOrFlowName: 'AF02',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: null,
            periodicity: Periodicity.Daily,
            startDate: '2025-04-01',
            startTime: '12:30:00',
            endDate: '2025-04-15',
            endTime: '14:30:00',
            selectedDate: null,
          },
          {
            appletId,
            appletVersion: '1.1.0',
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: 'd6234974-1282-46c3-b8a1-b4022fec348c',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:46:55.977562',
            eventVersionUpdatedAt: '2025-04-01T17:46:55.977569',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:46:55.983831',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: 'c990fee0-0400-45de-ada8-8ea79b4034f4',
            activityOrFlowName: 'AF03',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: null,
            periodicity: Periodicity.Daily,
            startDate: '2025-04-01',
            startTime: '15:30:00',
            endDate: '2025-04-15',
            endTime: '19:30:00',
            selectedDate: null,
          },
          {
            appletId,
            appletVersion: '1.1.0',
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: 'f1940118-5233-455d-8b8c-dbe4e57dd5a5',
            eventType: 'flow',
            eventVersion: '20250401-1',
            eventVersionCreatedAt: '2025-04-01T17:47:29.872067',
            eventVersionUpdatedAt: '2025-04-01T17:47:29.872073',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-01T17:47:29.878175',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId: 'af1c2236-2b84-4e15-89d8-2654508db925',
            activityOrFlowName: 'AF04',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: null,
            periodicity: Periodicity.Daily,
            startDate: '2025-04-01',
            startTime: '21:30:00',
            endDate: '2025-04-15',
            endTime: '23:59:00',
            selectedDate: null,
          },
          {
            appletId,
            appletVersion: '1.1.0',
            appletName: 'NIMH 01',
            userId: null,
            subjectId: null,
            eventId: 'a8512d9a-6441-4157-8f75-7b9fa58b8159',
            eventType: 'flow',
            eventVersion: '20250402-1',
            eventVersionCreatedAt: '2025-04-02T15:36:46.318758',
            eventVersionUpdatedAt: '2025-04-02T15:36:46.318764',
            eventVersionIsDeleted: false,
            linkedWithAppletAt: '2025-04-02T15:36:46.333157',
            eventUpdatedBy: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            activityOrFlowId,
            activityOrFlowName: 'AF01',
            activityOrFlowHidden: false,
            accessBeforeSchedule: false,
            oneTimeCompletion: null,
            periodicity: Periodicity.Daily,
            startDate: '2025-04-03',
            startTime: '07:00:00',
            endDate: '2025-04-17',
            endTime: '11:00:00',
            selectedDate: null,
          },
        ];

        const filteredScheduleHistoryData = mockScheduleHistoryData.filter(
          (it) => it.eventId === eventId,
        );

        jest
          .spyOn(exporter, 'getScheduleHistoryData')
          .mockImplementation(async (): Promise<ScheduleHistoryData[]> => mockScheduleHistoryData);

        jest.spyOn(exporter, 'getDeviceScheduleHistoryData').mockImplementationOnce(async () => [
          {
            userId: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: 'd41a1967-d835-4285-9b1c-cffb8cffe952',
            eventVersion: '20250401-1',
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:12:28.350314',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: 'c03b3bc2-6161-4615-8163-a6a9c158158e',
            eventVersion: '20250401-1',
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:12:28.350322',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: 'a8512d9a-6441-4157-8f75-7b9fa58b8159',
            eventVersion: '20250401-1',
            startDate: '2025-04-01',
            startTime: '07:00:00',
            endDate: '2025-04-15',
            endTime: '11:00:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:12:28.350330',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: '0bc02535-a994-4719-897a-a3d58ba54ba2',
            eventVersion: '20250401-1',
            startDate: '2025-04-01',
            startTime: '12:30:00',
            endDate: '2025-04-15',
            endTime: '14:30:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:12:28.350338',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: 'd6234974-1282-46c3-b8a1-b4022fec348c',
            eventVersion: '20250401-1',
            startDate: '2025-04-01',
            startTime: '15:30:00',
            endDate: '2025-04-15',
            endTime: '19:30:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:12:28.350346',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: 'f1940118-5233-455d-8b8c-dbe4e57dd5a5',
            eventVersion: '20250401-1',
            startDate: '2025-04-01',
            startTime: '21:30:00',
            endDate: '2025-04-15',
            endTime: '23:59:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:12:28.350354',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: '685dff7e-3372-495a-8b3d-92eb35241ddb',
            eventVersion: '20250401-1',
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:18:02.838910',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: '7481a981-3ecc-449e-b2d5-4da13eb536fc',
            eventVersion: '20250401-1',
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:18:02.838927',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: '9fd81b2c-0bf1-444f-ba94-a1e08cf68784',
            eventVersion: '20250401-1',
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:18:02.838935',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: '19dc6500-bb2d-4f23-95bc-b2463e86c5e0',
            eventVersion: '20250401-1',
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:18:02.838943',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: 'd41a1967-d835-4285-9b1c-cffb8cffe952',
            eventVersion: '20250401-1',
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:18:02.838951',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: 'c03b3bc2-6161-4615-8163-a6a9c158158e',
            eventVersion: '20250401-1',
            startDate: null,
            startTime: '00:00:00',
            endDate: null,
            endTime: '23:59:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-02T15:18:02.838959',
            userTimeZone: 'Europe/Kiev',
          },
          {
            userId: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            deviceId:
              'cJ0oRie3P0N2sHGXKicmKr:APA91bFpQ1KqaFiPb-3mTirpy_x9__pEGz88pp68BJvwQf6Bp8ou3RXPqPq-RMW65hOcjjCJJKMBli8TC4pQkcPalXHQXljJI_7P5AS-I6Cn3MW_Yyn2yrw',
            eventId: 'a8512d9a-6441-4157-8f75-7b9fa58b8159',
            eventVersion: '20250402-1',
            startDate: '2025-04-03',
            startTime: '07:00:00',
            endDate: '2025-04-17',
            endTime: '11:00:00',
            accessBeforeSchedule: false,
            createdAt: '2025-04-10T11:24:20.255793',
            userTimeZone: 'Europe/Kiev',
          },
        ]);

        // @ts-expect-error respondent data doesn't conform to its type definition
        jest.spyOn(exporter, 'getRespondentData').mockImplementation(async () => [
          {
            id: '50dd180f-609d-4eea-9c1b-a8024a83eb15',
            nicknames: ['Ross G.'],
            secretIds: ['ross'],
            isAnonymousRespondent: false,
            lastSeen: null,
            isPinned: false,
            details: [
              {
                appletId,
                appletDisplayName: 'NIMH 01',
                appletImage: '',
                accessId: 'b386e161-ee5b-469e-9463-28314ea70db0',
                respondentNickname: 'Ross G.',
                respondentSecretId: 'ross',
                hasIndividualSchedule: true,
                encryption: {
                  publicKey:
                    '[54,156,139,2,189,104,203,143,87,126,45,21,126,149,202,110,105,59,78,173,90,195,99,32,152,179,118,46,88,162,181,175,90,146,120,220,74,217,185,248,135,175,45,51,165,84,5,118,20,146,168,126,121,117,253,19,1,94,123,120,100,184,107,97,47,190,76,202,160,93,58,137,116,170,145,123,82,81,63,254,162,73,79,212,231,140,64,252,176,235,135,82,200,166,216,253,48,135,76,225,38,51,129,68,204,94,99,252,124,228,87,16,98,76,89,52,33,216,162,30,92,100,154,176,221,246,210,153]',
                  prime:
                    '[253,248,90,120,216,246,31,0,226,134,172,248,90,126,42,170,135,32,92,167,238,239,74,222,63,141,186,19,103,129,104,7,141,209,83,14,233,199,228,186,51,243,154,131,20,88,62,110,0,98,166,179,48,30,251,158,104,43,186,6,182,97,171,72,67,65,129,143,95,139,196,6,203,49,62,161,253,135,191,60,71,105,229,68,39,33,204,82,152,249,237,11,110,208,245,162,51,231,223,128,216,220,79,180,181,244,249,43,191,147,246,133,174,247,236,154,73,231,146,248,194,21,144,154,105,101,123,91]',
                  base: '[2]',
                  accountId: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
                },
                subjectId: '396d9ba8-090a-48bc-a772-e89361f90740',
                subjectTag: 'Parent',
                subjectFirstName: 'Ross',
                subjectLastName: 'Gellar',
                subjectCreatedAt: '2025-04-01T17:41:48.939810',
                invitation: {
                  email: 'geria.test+ross@gmail.com',
                  appletId,
                  appletName: 'NIMH 01',
                  role: 'respondent',
                  key: 'd58553bc-c7d4-3e8b-ae43-3ca677ef9591',
                  status: 'approved',
                  firstName: 'Ross',
                  lastName: 'Gellar',
                  createdAt: '2025-04-01T17:41:48.991260',
                  meta: {
                    subject_id: '396d9ba8-090a-48bc-a772-e89361f90740',
                    secret_user_id: null,
                  },
                  nickname: 'Ross G.',
                  secretUserId: 'ross',
                  tag: 'Parent',
                  title: null,
                },
                roles: ['respondent'],
                teamMemberCanViewData: true,
              },
            ],
            status: 'invited',
            email: 'geria.test+ross@gmail.com',
            subjects: ['396d9ba8-090a-48bc-a772-e89361f90740'],
          },
          {
            id: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
            nicknames: ['dev01 test'],
            secretIds: ['3083dbfd-cd85-4d1b-8c6d-f1ab804b24ce'],
            isAnonymousRespondent: false,
            lastSeen: null,
            isPinned: false,
            details: [
              {
                appletId,
                appletDisplayName: 'NIMH 01',
                appletImage: '',
                accessId: '3ac455fc-cac0-4de8-94e6-e9cf0b91de6a',
                respondentNickname: 'dev01 test',
                respondentSecretId: '3083dbfd-cd85-4d1b-8c6d-f1ab804b24ce',
                hasIndividualSchedule: false,
                encryption: {
                  publicKey:
                    '[54,156,139,2,189,104,203,143,87,126,45,21,126,149,202,110,105,59,78,173,90,195,99,32,152,179,118,46,88,162,181,175,90,146,120,220,74,217,185,248,135,175,45,51,165,84,5,118,20,146,168,126,121,117,253,19,1,94,123,120,100,184,107,97,47,190,76,202,160,93,58,137,116,170,145,123,82,81,63,254,162,73,79,212,231,140,64,252,176,235,135,82,200,166,216,253,48,135,76,225,38,51,129,68,204,94,99,252,124,228,87,16,98,76,89,52,33,216,162,30,92,100,154,176,221,246,210,153]',
                  prime:
                    '[253,248,90,120,216,246,31,0,226,134,172,248,90,126,42,170,135,32,92,167,238,239,74,222,63,141,186,19,103,129,104,7,141,209,83,14,233,199,228,186,51,243,154,131,20,88,62,110,0,98,166,179,48,30,251,158,104,43,186,6,182,97,171,72,67,65,129,143,95,139,196,6,203,49,62,161,253,135,191,60,71,105,229,68,39,33,204,82,152,249,237,11,110,208,245,162,51,231,223,128,216,220,79,180,181,244,249,43,191,147,246,133,174,247,236,154,73,231,146,248,194,21,144,154,105,101,123,91]',
                  base: '[2]',
                  accountId: 'd2cfce85-52ae-4950-890b-1c7e02f4fc11',
                },
                subjectId: '5969b13d-72d8-4513-b69f-9b7ace66d3b3',
                subjectTag: 'Team',
                subjectFirstName: 'dev01',
                subjectLastName: 'test',
                subjectCreatedAt: '2025-04-01T17:29:32.369173',
                invitation: null,
                roles: ['owner', 'respondent'],
                teamMemberCanViewData: true,
              },
            ],
            status: 'invited',
            email: 'geria.test+dev01@gmail.com',
            subjects: ['5969b13d-72d8-4513-b69f-9b7ace66d3b3'],
          },
        ]);

        const rows = await exporter.generateExportData({
          appletId,
          fromDate: '2025-04-01T17:29:32',
          toDate: '2025-04-14T22:21:55',
        });

        const filteredRows = rows.filter((it) => it.activity_or_flow_id === activityOrFlowId);

        const groupedByDate = groupBy(filteredRows, (it) => it.schedule_date);

        console.log(groupedByDate);
      },
    );
  });
});
