/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  getEventsWithHiddenInTimeView,
  getNotHiddenEvents,
  getNextDayComparison,
  getPreparedEvents,
} from './CalendarEvents.utils';

describe('CalendarEvents.utils', () => {
  describe('getNextDayComparison', () => {
    test.each`
      startTime  | endTime    | expected
      ${'14:00'} | ${'05:00'} | ${true}
      ${'00:00'} | ${'23:59'} | ${false}
      ${'12:00'} | ${'12:00'} | ${false}
    `(
      'startTime=$startTime, endTime=$endTime, expected=$expected:',
      ({ startTime, endTime, expected }) => {
        expect(getNextDayComparison(startTime, endTime)).toBe(expected);
      },
    );
  });

  describe('getPreparedEvents: should', () => {
    const events = [
      { id: 1, alwaysAvailable: true },
      { id: 2, alwaysAvailable: false },
    ];
    const expected1 = [
      { id: 1, alwaysAvailable: true, isHidden: true },
      { id: 2, alwaysAvailable: false, isHidden: false },
    ];
    const expected2 = [
      { id: 1, alwaysAvailable: true, isHidden: false },
      { id: 2, alwaysAvailable: false, isHidden: true },
    ];
    const expected3 = [
      { id: 1, alwaysAvailable: true, isHidden: false },
      { id: 2, alwaysAvailable: false, isHidden: false },
    ];

    test.each`
      isAlwaysAvailableHidden | isScheduledHidden | expected     | description
      ${true}                 | ${false}          | ${expected1} | ${'set isHidden to true if alwaysAvailable and isAlwaysAvailableHidden is true'}
      ${false}                | ${true}           | ${expected2} | ${'set isHidden to true if !alwaysAvailable and isScheduledHidden is true'}
      ${false}                | ${false}          | ${expected3} | ${'not change isHidden if neither condition is met'}
    `(
      '$description; isAlwaysAvailableHidden=$isAlwaysAvailableHidden, isScheduledHidden=$isScheduledHidden',
      ({ isAlwaysAvailableHidden, isScheduledHidden, expected }) => {
        expect(getPreparedEvents(events, isAlwaysAvailableHidden, isScheduledHidden)).toEqual(
          expected,
        );
      },
    );
  });

  describe('getNotHiddenEvents: should return', () => {
    const hiddenEvents = [
      { id: 1, isHidden: true },
      { id: 2, isHidden: true },
    ];
    const visibleEvents = [
      { id: 3, isHidden: false },
      { id: 4, isHidden: false },
    ];
    const events1 = [...hiddenEvents, ...visibleEvents];

    test.each`
      events           | expected         | description
      ${events1}       | ${visibleEvents} | ${'only visible events when there are hidden and visible events'}
      ${hiddenEvents}  | ${[]}            | ${'an empty array when all events are hidden'}
      ${visibleEvents} | ${visibleEvents} | ${'the same array when all events are visible'}
      ${[]}            | ${[]}            | ${'an empty array when input array is empty'}
    `('$description', ({ events, expected }) => {
      expect(getNotHiddenEvents(events)).toEqual(expected);
    });
  });

  describe('getEventsWithHiddenInTimeView', () => {
    const mockedEvents = [
      { id: 1, start: new Date('2023-11-12'), allDay: true, alwaysAvailable: true },
      { id: 2, start: new Date('2023-11-12'), allDay: true, alwaysAvailable: false },
      { id: 3, start: new Date('2023-11-15'), allDay: false, alwaysAvailable: false },
      { id: 4, start: new Date('2023-11-12'), allDay: true, alwaysAvailable: false },
      { id: 5, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
      { id: 6, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
      { id: 7, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
      { id: 8, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
      { id: 9, start: new Date('2023-11-12'), allDay: true, alwaysAvailable: false },
      { id: 10, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
    ];

    test('should return the correct result', () => {
      const result = getEventsWithHiddenInTimeView(mockedEvents);
      expect(result).toHaveProperty('eventsToShow');
      expect(result).toHaveProperty('allDayEventsSortedByDays');
      expect(result).toHaveProperty('hiddenEventsIds');

      expect(result).toEqual({
        eventsToShow: [
          {
            id: 1,
            start: new Date('2023-11-12'),
            allDay: true,
            alwaysAvailable: true,
            isHiddenInTimeView: false,
          },
          {
            id: 2,
            start: new Date('2023-11-12'),
            allDay: true,
            alwaysAvailable: false,
            isHiddenInTimeView: false,
          },
          {
            id: 3,
            start: new Date('2023-11-15'),
            allDay: false,
            alwaysAvailable: false,
            isHiddenInTimeView: false,
          },
          {
            id: 4,
            start: new Date('2023-11-12'),
            allDay: true,
            alwaysAvailable: false,
            isHiddenInTimeView: false,
          },
          {
            id: 5,
            start: new Date('2023-11-12'),
            allDay: false,
            alwaysAvailable: true,
            isHiddenInTimeView: true,
          },
          {
            id: 6,
            start: new Date('2023-11-12'),
            allDay: false,
            alwaysAvailable: true,
            isHiddenInTimeView: true,
          },
          {
            id: 7,
            start: new Date('2023-11-12'),
            allDay: false,
            alwaysAvailable: true,
            isHiddenInTimeView: true,
          },
          {
            id: 8,
            start: new Date('2023-11-12'),
            allDay: false,
            alwaysAvailable: true,
            isHiddenInTimeView: true,
          },
          {
            id: 9,
            start: new Date('2023-11-12'),
            allDay: true,
            alwaysAvailable: false,
            isHiddenInTimeView: true,
          },
          {
            id: 10,
            start: new Date('2023-11-12'),
            allDay: false,
            alwaysAvailable: true,
            isHiddenInTimeView: true,
          },
        ],
        allDayEventsSortedByDays: [
          {
            eventsIds: [
              {
                id: 1,
                isHiddenInTimeView: false,
              },
              {
                id: 2,
                isHiddenInTimeView: false,
              },
              {
                id: 4,
                isHiddenInTimeView: false,
              },
              {
                id: 5,
                isHiddenInTimeView: true,
              },
              {
                id: 6,
                isHiddenInTimeView: true,
              },
              {
                id: 7,
                isHiddenInTimeView: true,
              },
              {
                id: 8,
                isHiddenInTimeView: true,
              },
              {
                id: 9,
                isHiddenInTimeView: true,
              },
              {
                id: 10,
                isHiddenInTimeView: true,
              },
            ],
            week: '45 2023',
            date: '12 Nov 2023',
          },
        ],
        hiddenEventsIds: [5, 6, 7, 8, 9, 10],
      });
    });
  });
});
