import { DateTime } from 'luxon';

import { Periodicity, ScheduleHistoryData } from 'modules/Dashboard/api';
import { ScheduleHistoryExporter } from 'shared/utils/exportData/exporters/ScheduleHistoryExporter';

describe('ScheduleHistoryExporter', () => {
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
      eventUpdatedBy: 'some-admin-user-id',
      userId: null,
      subjectId: null,

      linkedWithAppletAt: '2025-03-12T22:46:47.275941',
      accessBeforeSchedule: false,
      oneTimeCompletion: false,
      ...override,
    });

    const exporter = new ScheduleHistoryExporter('applet-id');

    const scheduleHistoryData: ScheduleHistoryData[] = [
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
        userId: 'user-2',
        subjectId: 'user-2-subject',
        eventVersionCreatedAt: '2025-03-12T00:01:00',
        eventVersionUpdatedAt: '2025-03-12T00:01:00',
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
        eventVersion: 'v2',
        userId: 'user-2',
        subjectId: 'user-2-subject',
        eventVersionCreatedAt: '2025-03-12T00:02:00',
        eventVersionUpdatedAt: '2025-03-12T00:02:00',
        eventVersionIsDeleted: false,
        periodicity: Periodicity.Daily,
        startDate: '2025-03-12',
        startTime: '10:00:00',
        endDate: '2025-12-31',
        endTime: '11:00:00',
        selectedDate: null,
      }),
      scheduleData({
        eventId: 'default-schedule-event-1',
        eventVersion: 'v2',
        userId: null,
        subjectId: null,
        eventVersionCreatedAt: '2025-03-12T00:03:00',
        eventVersionUpdatedAt: '2025-03-12T00:03:00',
        eventVersionIsDeleted: false,
        periodicity: Periodicity.Weekly,
        startDate: '2025-03-15',
        startTime: '09:00:00',
        endDate: '2025-12-31',
        endTime: '10:00:00',
        selectedDate: '2025-03-15',
      }),
      scheduleData({
        eventId: 'default-schedule-event-2',
        eventVersion: 'v1',
        userId: null,
        subjectId: null,
        eventVersionCreatedAt: '2025-03-12T00:04:00',
        eventVersionUpdatedAt: '2025-03-12T00:04:00',
        eventVersionIsDeleted: false,
        periodicity: Periodicity.Weekly,
        startDate: '2025-03-16',
        startTime: '09:00:00',
        endDate: '2025-12-31',
        endTime: '10:00:00',
        selectedDate: '2025-03-16',
      }),
    ];

    describe('Default schedule user', () => {
      const defaultScheduleUser = 'default-schedule-user';
      const individualScheduleUser = 'individual-schedule-user';
      const individualScheduleUserSubject = 'individual-schedule-user-subject';
      describe('Event created', () => {
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
              it('deleted before start time', () => {
                scheduleHistoryData.push(
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

              it('deleted after start time', () => {
                scheduleHistoryData.push(
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
        });

        describe('ONCE', () => {
          const scheduleHistoryData: ScheduleHistoryData[] = [
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

          it('does not apply to the weekend', () => {
            // TODO: Implement
          });
        });

        describe('MONTHLY', () => {
          const scheduleHistoryData: ScheduleHistoryData[] = [
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

      describe('Event created and updated on the same day', () => {
        describe('Changed to a different day', () => {
          describe('Find for creation day', () => {
            const day = '2025-03-12';

            it('ALWAYS -> ONCE', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Once,
                  startDate: null,
                  startTime: '09:00:00',
                  endDate: null,
                  endTime: '10:00:00',
                  selectedDate: '2025-03-13',
                }),
              ];

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

            it('ALWAYS -> DAILY', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Daily,
                  startDate: '2025-03-13',
                  startTime: '09:00:00',
                  endDate: '2025-12-31',
                  endTime: '10:00:00',
                  selectedDate: null,
                }),
              ];

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

            it('ALWAYS -> WEEKLY', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Weekly,
                  startDate: '2025-03-13',
                  startTime: '09:00:00',
                  endDate: '2025-12-31',
                  endTime: '10:00:00',
                  selectedDate: '2025-03-13',
                }),
              ];

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

            it('ALWAYS -> WEEKDAYS', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Weekdays,
                  startDate: '2025-03-13',
                  startTime: '09:00:00',
                  endDate: '2025-12-31',
                  endTime: '10:00:00',
                  selectedDate: null,
                }),
              ];

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

            it('ALWAYS -> MONTHLY', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Monthly,
                  startDate: '2025-03-13',
                  startTime: '09:00:00',
                  endDate: '2025-12-31',
                  endTime: '10:00:00',
                  selectedDate: '2025-03-13',
                }),
              ];

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

          describe('Find for day between creation and event day', () => {
            const day = '2025-03-13';

            it('ALWAYS -> ONCE', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Once,
                  startDate: null,
                  startTime: '09:00:00',
                  endDate: null,
                  endTime: '10:00:00',
                  selectedDate: '2025-03-14',
                }),
              ];

              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              // Even though the new event exists, it doesn't apply on this date
              expect(foundSchedules).toEqual([]);
            });
          });

          describe('Find for day of updated event', () => {
            const day = '2025-03-13';

            it('ALWAYS -> ONCE', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Once,
                  startDate: null,
                  startTime: '09:00:00',
                  endDate: null,
                  endTime: '10:00:00',
                  selectedDate: '2025-03-13',
                }),
              ];

              const foundSchedules = exporter.findSchedulesForDay(
                day,
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
            });

            it('ALWAYS -> DAILY', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Daily,
                  startDate: '2025-03-13',
                  startTime: '09:00:00',
                  endDate: '2025-12-31',
                  endTime: '10:00:00',
                  selectedDate: null,
                }),
              ];

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

            it('ALWAYS -> WEEKLY', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Weekly,
                  startDate: '2025-03-13',
                  startTime: '09:00:00',
                  endDate: '2025-12-31',
                  endTime: '10:00:00',
                  selectedDate: '2025-03-13',
                }),
              ];

              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  periodicity: Periodicity.Weekly,
                }),
              ]);
            });

            it('ALWAYS -> WEEKDAYS', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Weekdays,
                  startDate: '2025-03-13',
                  startTime: '09:00:00',
                  endDate: '2025-12-31',
                  endTime: '10:00:00',
                  selectedDate: null,
                }),
              ];

              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  periodicity: Periodicity.Weekdays,
                }),
              ]);
            });

            it('ALWAYS -> MONTHLY', async () => {
              const scheduleHistoryData: ScheduleHistoryData[] = [
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
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  userId: null,
                  subjectId: null,
                  eventVersionCreatedAt: '2025-03-12T00:03:00',
                  eventVersionUpdatedAt: '2025-03-12T00:03:00',
                  eventVersionIsDeleted: false,
                  periodicity: Periodicity.Monthly,
                  startDate: '2025-03-13',
                  startTime: '09:00:00',
                  endDate: '2025-12-31',
                  endTime: '10:00:00',
                  selectedDate: '2025-03-13',
                }),
              ];

              const foundSchedules = exporter.findSchedulesForDay(
                day,
                defaultScheduleUser,
                scheduleHistoryData,
              );

              expect(foundSchedules).toEqual([
                expect.objectContaining({
                  eventId: 'default-schedule-event-1',
                  eventVersion: 'v2',
                  periodicity: Periodicity.Monthly,
                }),
              ]);
            });
          });
        });

        describe('Changed to the same day', () => {
          const day = '2025-03-12';

          it('ALWAYS -> ONCE', async () => {
            const scheduleHistoryData: ScheduleHistoryData[] = [
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
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:03:00',
                eventVersionUpdatedAt: '2025-03-12T00:03:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '09:00:00',
                endDate: null,
                endTime: '10:00:00',
                selectedDate: '2025-03-12',
              }),
            ];

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
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                periodicity: Periodicity.Once,
              }),
            ]);
          });

          it('ALWAYS -> DAILY', async () => {
            const scheduleHistoryData: ScheduleHistoryData[] = [
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
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:03:00',
                eventVersionUpdatedAt: '2025-03-12T00:03:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Daily,
                startDate: '2025-03-12',
                startTime: '09:00:00',
                endDate: '2025-12-31',
                endTime: '10:00:00',
                selectedDate: null,
              }),
            ];

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
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                periodicity: Periodicity.Daily,
              }),
            ]);
          });

          it('ALWAYS -> WEEKLY', async () => {
            const scheduleHistoryData: ScheduleHistoryData[] = [
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
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:03:00',
                eventVersionUpdatedAt: '2025-03-12T00:03:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekly,
                startDate: '2025-03-12',
                startTime: '09:00:00',
                endDate: '2025-12-31',
                endTime: '10:00:00',
                selectedDate: '2025-03-12',
              }),
            ];

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
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                periodicity: Periodicity.Weekly,
              }),
            ]);
          });

          it('ALWAYS -> WEEKDAYS', async () => {
            const scheduleHistoryData: ScheduleHistoryData[] = [
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
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:03:00',
                eventVersionUpdatedAt: '2025-03-12T00:03:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Weekdays,
                startDate: '2025-03-12',
                startTime: '09:00:00',
                endDate: '2025-12-31',
                endTime: '10:00:00',
                selectedDate: null,
              }),
            ];

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
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                periodicity: Periodicity.Weekdays,
              }),
            ]);
          });

          it('ALWAYS -> MONTHLY', async () => {
            const scheduleHistoryData: ScheduleHistoryData[] = [
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
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-12T00:03:00',
                eventVersionUpdatedAt: '2025-03-12T00:03:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Monthly,
                startDate: '2025-03-12',
                startTime: '09:00:00',
                endDate: '2025-12-31',
                endTime: '10:00:00',
                selectedDate: '2025-03-12',
              }),
            ];

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
              expect.objectContaining({
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                periodicity: Periodicity.Monthly,
              }),
            ]);
          });
        });
      });

      describe('Event created and updated on different days', () => {
        describe('Find for creation day', () => {
          const day = '2025-03-12';

          it('ALWAYS -> ONCE', async () => {
            const scheduleHistoryData: ScheduleHistoryData[] = [
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
                eventId: 'default-schedule-event-1',
                eventVersion: 'v2',
                userId: null,
                subjectId: null,
                eventVersionCreatedAt: '2025-03-13T00:03:00',
                eventVersionUpdatedAt: '2025-03-13T00:03:00',
                eventVersionIsDeleted: false,
                periodicity: Periodicity.Once,
                startDate: null,
                startTime: '09:00:00',
                endDate: null,
                endTime: '10:00:00',
                selectedDate: '2025-03-13',
              }),
            ];

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
      });
    });

    describe('Individual schedule user', () => {
      const userId = 'individual-schedule-user-1';
      it('handles user with default schedule: weekly event', async () => {
        const foundSchedules = exporter.findSchedulesForDay(
          '2025-03-16',
          'user-1',
          scheduleHistoryData,
        );

        expect(foundSchedules).toEqual([
          expect.objectContaining({
            eventId: 'default-schedule-event-2',
            eventVersion: 'v1',
            periodicity: Periodicity.Weekly,
          }),
        ]);
      });
    });
  });
});
