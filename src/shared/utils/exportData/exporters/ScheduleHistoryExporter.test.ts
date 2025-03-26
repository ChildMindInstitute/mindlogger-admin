import { DateTime } from 'luxon';

import { Periodicity, ScheduleHistoryData } from 'modules/Dashboard/api';
import { ScheduleHistoryExporter } from 'shared/utils/exportData/exporters/ScheduleHistoryExporter';

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
    ): ScheduleHistoryData => ({
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

      linkedWithAppletAt: '2025-03-12T22:46:47.275941',
      accessBeforeSchedule: false,
      oneTimeCompletion: false,
      ...override,
    });

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
          const creationDay = DateTime.fromISO('2025-03-12');
          const tenYearsAfterCreation = creationDay.plus({ years: 10 });

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

            // Individual schedule applies after
            const individualScheduleCreationDay = DateTime.fromISO('2025-03-15');
            const tenYearsAfterCreation = individualScheduleCreationDay.plus({ years: 10 });

            exporter
              .daysBetweenInterval(individualScheduleCreationDay, tenYearsAfterCreation)
              .forEach((day) => {
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
                selectedDate: '2025-03-15',
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

            // Nothing applies after the selected date
            const theDayAfter = DateTime.fromISO('2025-03-16');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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
                startDate: '2025-03-15',
                startTime: '00:00:00',
                endDate: '2025-03-19',
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
                    periodicity: Periodicity.Daily,
                  }),
                ]);
              },
            );

            // Nothing applies after the end date
            const theDayAfter = DateTime.fromISO('2025-03-20');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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

            // Nothing applies until the start date of the Individual schedule
            ['2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'].forEach(
              (day) => {
                const foundSchedules = exporter.findSchedulesForDay(
                  day,
                  individualScheduleUser,
                  scheduleHistoryData,
                );

                expect(foundSchedules).toEqual([]);
              },
            );

            // Individual schedule applies after
            const applicableDays = ['2025-03-20', '2025-03-27'];
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-03-20'), DateTime.fromISO('2025-03-31'))
              .forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2025-04-01');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-03-15'), DateTime.fromISO('2025-03-20'))
              .forEach((day) => {
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

            // Nothing applies after the end date
            const theDayAfter = DateTime.fromISO('2025-03-21');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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

            // Nothing applies until the start date of the Individual schedule
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-03-15'), DateTime.fromISO('2025-04-30'))
              .forEach((day) => {
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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-05-01'), DateTime.fromISO('2025-12-31'))
              .forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2026-01-01');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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
                const individualScheduleDeletionDay = DateTime.fromISO('2025-03-20');
                const tenYearsAfterCreation = individualScheduleDeletionDay.plus({ years: 10 });

                exporter
                  .daysBetweenInterval(
                    individualScheduleDeletionDay.plus({ days: 1 }),
                    tenYearsAfterCreation,
                  )
                  .forEach((day) => {
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
                const individualScheduleDeletionDay = DateTime.fromISO('2025-03-21');
                const tenYearsAfterCreation = individualScheduleDeletionDay.plus({ years: 10 });

                exporter
                  .daysBetweenInterval(
                    individualScheduleDeletionDay.plus({ days: 1 }),
                    tenYearsAfterCreation,
                  )
                  .forEach((day) => {
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
                const individualScheduleDeletionDay = DateTime.fromISO('2025-03-21');
                const tenYearsAfterCreation = individualScheduleDeletionDay.plus({ years: 10 });

                exporter
                  .daysBetweenInterval(
                    individualScheduleDeletionDay.plus({ days: 1 }),
                    tenYearsAfterCreation,
                  )
                  .forEach((day) => {
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
                const individualScheduleDeletionDay = DateTime.fromISO('2025-03-21');
                const tenYearsAfterCreation = individualScheduleDeletionDay.plus({ years: 10 });

                exporter
                  .daysBetweenInterval(
                    individualScheduleDeletionDay.plus({ days: 1 }),
                    tenYearsAfterCreation,
                  )
                  .forEach((day) => {
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
              const theDayAfter = DateTime.fromISO('2025-03-16');
              const tenYearsAfter = theDayAfter.plus({ years: 10 });

              exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
              const theDayAfter = DateTime.fromISO('2025-03-17');
              const tenYearsAfter = theDayAfter.plus({ years: 10 });

              exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-18');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-19');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-19');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-19');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-03-26'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-27');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-03-26'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-28');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-03-26'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-28');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-03-26'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-28');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-03-26'),
                  )
                  .forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-21'),
                    DateTime.fromISO('2025-03-26'),
                  )
                  .forEach((day) => {
                    const foundSchedules = exporter.findSchedulesForDay(
                      day,
                      individualScheduleUser,
                      scheduleHistoryData,
                    );

                    expect(foundSchedules).toEqual([]);
                  });

                // Default schedule applies on the deletion date and afterwards
                const theDayAfter = DateTime.fromISO('2025-03-27');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-03-26'),
                  )
                  .forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-21'),
                    DateTime.fromISO('2025-03-27'),
                  )
                  .forEach((day) => {
                    const foundSchedules = exporter.findSchedulesForDay(
                      day,
                      individualScheduleUser,
                      scheduleHistoryData,
                    );

                    expect(foundSchedules).toEqual([]);
                  });

                // Default schedule applies on the deletion date and afterwards
                const theDayAfter = DateTime.fromISO('2025-03-28');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-03-19'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-21');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-03-20'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-03-21');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-04-30'),
                  )
                  .forEach((day) => {
                    const foundSchedules = exporter.findSchedulesForDay(
                      day,
                      individualScheduleUser,
                      scheduleHistoryData,
                    );

                    expect(foundSchedules).toEqual([]);
                  });

                const applicableDays = ['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01'];

                // Individual schedule applies until deleted
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-08-09'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-08-10');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-04-30'),
                  )
                  .forEach((day) => {
                    const foundSchedules = exporter.findSchedulesForDay(
                      day,
                      individualScheduleUser,
                      scheduleHistoryData,
                    );

                    expect(foundSchedules).toEqual([]);
                  });

                const applicableDays = ['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01'];

                // Individual schedule applies until deleted
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-08-09'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-08-11');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-04-30'),
                  )
                  .forEach((day) => {
                    const foundSchedules = exporter.findSchedulesForDay(
                      day,
                      individualScheduleUser,
                      scheduleHistoryData,
                    );

                    expect(foundSchedules).toEqual([]);
                  });

                const applicableDays = ['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01'];

                // Individual schedule applies until deleted
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-08-09'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-08-10');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-04-30'),
                  )
                  .forEach((day) => {
                    const foundSchedules = exporter.findSchedulesForDay(
                      day,
                      individualScheduleUser,
                      scheduleHistoryData,
                    );

                    expect(foundSchedules).toEqual([]);
                  });

                const applicableDays = ['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01'];

                // Individual schedule applies until deleted
                exporter
                  .daysBetweenInterval(
                    DateTime.fromISO('2025-03-15'),
                    DateTime.fromISO('2025-08-09'),
                  )
                  .forEach((day) => {
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
                const theDayAfter = DateTime.fromISO('2025-08-11');
                const tenYearsAfter = theDayAfter.plus({ years: 10 });

                exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
            const v2CreationDay = DateTime.fromISO('2025-03-15');
            const tenYearsAfterCreation = v2CreationDay.plus({ years: 10 });

            exporter.daysBetweenInterval(v2CreationDay, tenYearsAfterCreation).forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2025-03-16');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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
            const theDayAfter = DateTime.fromISO('2025-03-20');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-03-20'), DateTime.fromISO('2025-03-31'))
              .forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2025-04-01');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-03-15'), DateTime.fromISO('2025-03-20'))
              .forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2025-03-21');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-03-15'), DateTime.fromISO('2025-04-30'))
              .forEach((day) => {
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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-05-01'), DateTime.fromISO('2025-12-31'))
              .forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2026-01-01');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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
            const v2CreationDay = DateTime.fromISO('2025-03-15');
            const tenYearsAfterCreation = v2CreationDay.plus({ years: 10 });

            exporter.daysBetweenInterval(v2CreationDay, tenYearsAfterCreation).forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2025-03-16');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

            exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2025-03-20');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

            exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-03-20'), DateTime.fromISO('2025-03-31'))
              .forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2025-04-01');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

            exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-03-15'), DateTime.fromISO('2025-03-20'))
              .forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2025-03-21');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

            exporter.daysBetweenInterval(theDayAfter, tenYearsAfter).forEach((day) => {
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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-03-15'), DateTime.fromISO('2025-04-30'))
              .forEach((day) => {
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
            exporter
              .daysBetweenInterval(DateTime.fromISO('2025-05-01'), DateTime.fromISO('2025-12-31'))
              .forEach((day) => {
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
            const theDayAfter = DateTime.fromISO('2026-01-01');
            const tenYearsAfter = theDayAfter.plus({ years: 10 });

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
          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-01-03'), DateTime.fromISO('2025-12-29'))
            .forEach((day) => {
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
          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-03-12'), DateTime.fromISO('2025-03-19'))
            .forEach((day) => {
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

          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-01-03'), DateTime.fromISO('2025-03-03'))
            .forEach((day) => {
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

          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-03-03'), DateTime.fromISO('2025-04-03'))
            .forEach((day) => {
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
          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-03-20'), DateTime.fromISO('2025-03-31'))
            .forEach((day) => {
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

          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-01-03'), DateTime.fromISO('2025-01-09'))
            .forEach((day) => {
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

          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-01-10'), DateTime.fromISO('2025-01-17'))
            .forEach((day) => {
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
          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-03-01'), DateTime.fromISO('2025-04-30'))
            .forEach((day) => {
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

          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-01-03'), DateTime.fromISO('2025-03-02'))
            .forEach((day) => {
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

          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-03-03'), DateTime.fromISO('2025-04-03'))
            .forEach((day) => {
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

          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-05-01'), DateTime.fromISO('2025-12-31'))
            .forEach((day) => {
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

          exporter
            .daysBetweenInterval(DateTime.fromISO('2025-01-01'), DateTime.fromISO('2025-12-31'))
            .forEach((day) => {
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
      const start = DateTime.fromISO('2025-03-12');
      const end = DateTime.fromISO('2025-03-15');

      const days = exporter.daysBetweenInterval(start, end);

      expect(days).toEqual(['2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15']);
    });

    it('works for a single day', () => {
      const start = DateTime.fromISO('2025-03-12');
      const end = DateTime.fromISO('2025-03-12');

      const days = exporter.daysBetweenInterval(start, end);

      expect(days).toEqual(['2025-03-12']);
    });

    it('works across months', () => {
      const start = DateTime.fromISO('2025-03-31');
      const end = DateTime.fromISO('2025-04-01');

      const days = exporter.daysBetweenInterval(start, end);

      expect(days).toEqual(['2025-03-31', '2025-04-01']);
    });

    it("doesn't work backwards", () => {
      const start = DateTime.fromISO('2025-03-15');
      const end = DateTime.fromISO('2025-03-12');

      const days = exporter.daysBetweenInterval(start, end);

      expect(days).toEqual([]);
    });
  });
});
