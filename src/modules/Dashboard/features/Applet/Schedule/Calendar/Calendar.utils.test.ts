/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { variables } from 'shared/styles';

import {
  getCalendarComponents,
  getDefaultStartDate,
  getHasWrapperMoreBtn,
  getBorderRadius,
  eventPropGetter,
} from './Calendar.utils';
import { CalendarViews } from './Calendar.types';

describe('Schedule.utils.tsx', () => {
  describe('getDefaultStartDate', () => {
    const pastDate = new Date('2020-01-01');
    const futureDate = new Date('2050-01-01');
    const formatToHHMM = (date: Date) => date.toISOString().slice(0, 16);
    test.each`
      date          | expected                    | description
      ${pastDate}   | ${formatToHHMM(new Date())} | ${'returns current date when provided date is in the past'}
      ${futureDate} | ${formatToHHMM(futureDate)} | ${'returns provided date when it is in the future'}
    `('$description', ({ date, expected }) => {
      expect(formatToHHMM(getDefaultStartDate(date))).toEqual(expected);
    });
  });

  describe('getHasWrapperMoreBtn', () => {
    const mockedSortedByDays = [
      {
        eventsIds: [
          {
            id: 'event-3348',
            isHiddenInTimeView: false,
          },
          {
            id: 'event-3713',
            isHiddenInTimeView: false,
          },
          {
            id: 'event-4078',
            isHiddenInTimeView: false,
          },
          {
            id: 'event-4443',
            isHiddenInTimeView: true,
          },
          {
            id: 'event-4808',
            isHiddenInTimeView: true,
          },
          {
            id: 'event-5173',
            isHiddenInTimeView: true,
          },
        ],
        week: '1 2024',
        date: '02 Jan 2024',
      },
    ];
    const mockedIsVisible1 = {
      period: '02 Jan 2024',
      visible: true,
    };
    const mockedIsVisible2 = {
      period: '02 Jan 2024',
      visible: false,
    };
    const mockedIsVisible3 = {
      period: '1 2024',
      visible: true,
    };
    const mockedIsVisible4 = {
      period: '1 2024',
      visible: false,
    };
    test.each`
      activeView             | date                      | isAllDayEventsVisible | allDayEventsSortedByDays | expected | description
      ${CalendarViews.Month} | ${new Date('2024-01-02')} | ${null}               | ${mockedSortedByDays}    | ${false} | ${'for Month view'}
      ${CalendarViews.Year}  | ${new Date('2024-01-02')} | ${null}               | ${mockedSortedByDays}    | ${false} | ${'for Year view'}
      ${CalendarViews.Day}   | ${new Date('2024-01-02')} | ${null}               | ${mockedSortedByDays}    | ${true}  | ${'for Day view with a day available in the list of allDayEventsSortedByDays'}
      ${CalendarViews.Day}   | ${new Date('2024-01-02')} | ${mockedIsVisible1}   | ${mockedSortedByDays}    | ${false} | ${'for Day view with isAllDayEventsVisible.visible true'}
      ${CalendarViews.Day}   | ${new Date('2024-01-02')} | ${mockedIsVisible2}   | ${mockedSortedByDays}    | ${true}  | ${'for Day view with isAllDayEventsVisible.visible false'}
      ${CalendarViews.Day}   | ${new Date('2024-01-03')} | ${null}               | ${mockedSortedByDays}    | ${false} | ${'for Day view with no day available in the list of allDayEventsSortedByDays'}
      ${CalendarViews.Week}  | ${new Date('2024-01-04')} | ${null}               | ${mockedSortedByDays}    | ${true}  | ${'for Week view with a week available in the list of allDayEventsSortedByDays'}
      ${CalendarViews.Week}  | ${new Date('2024-01-03')} | ${mockedIsVisible3}   | ${mockedSortedByDays}    | ${false} | ${'for Week view with isAllDayEventsVisible.visible true'}
      ${CalendarViews.Week}  | ${new Date('2024-01-02')} | ${mockedIsVisible4}   | ${mockedSortedByDays}    | ${true}  | ${'for Week view with isAllDayEventsVisible.visible false'}
      ${CalendarViews.Week}  | ${new Date('2024-01-25')} | ${null}               | ${mockedSortedByDays}    | ${false} | ${'for Week view with no week available in the list of allDayEventsSortedByDays'}
    `('returns $expected $description', ({ expected, ...props }) => {
      expect(getHasWrapperMoreBtn(props)).toBe(expected);
    });
  });

  describe('getCalendarComponents', () => {
    test('returns object with expected parameters', () => {
      const date = new Date();
      const setActiveViewMock = jest.fn();
      const setDateMock = jest.fn();
      const setEventsMock = jest.fn();
      const setIsAllDayEventsVisibleMock = jest.fn();

      const result = getCalendarComponents({
        activeView: CalendarViews.Month,
        setActiveView: setActiveViewMock,
        date,
        setDate: setDateMock,
        events: [],
        setEvents: setEventsMock,
        isAllDayEventsVisible: null,
        setIsAllDayEventsVisible: setIsAllDayEventsVisibleMock,
      });

      expect(result).toEqual({
        components: expect.objectContaining({
          toolbar: expect.any(Function),
          month: expect.objectContaining({
            dateHeader: expect.any(Function),
            header: expect.any(Function),
            event: expect.any(Function),
            eventWrapper: expect.any(Function),
          }),
          week: expect.objectContaining({
            header: expect.any(Function),
            eventContainerWrapper: expect.any(Function),
            eventWrapper: expect.any(Function),
            event: expect.any(Function),
          }),
          day: expect.objectContaining({
            header: expect.any(Function),
            eventContainerWrapper: expect.any(Function),
            eventWrapper: expect.any(Function),
            event: expect.any(Function),
          }),
          timeGutterHeader: expect.any(Function),
          date,
          setDate: setDateMock,
          activeView: CalendarViews.Month,
          setActiveView: setActiveViewMock,
          isAllDayEventsVisible: expect.any(Object),
        }),
        messages: expect.objectContaining({
          showMore: expect.any(Function),
        }),
        views: expect.objectContaining({
          month: expect.any(Function),
          day: true,
          week: true,
          year: expect.any(Function),
        }),
        formats: expect.objectContaining({
          dayHeaderFormat: expect.any(Function),
          dayRangeHeaderFormat: expect.any(Function),
          timeGutterFormat: expect.any(Function),
        }),
      });
    });
  });

  describe('getBorderRadius', () => {
    const expected1 = `0 0 ${variables.borderRadius.md} ${variables.borderRadius.md}`;
    const expected2 = `${variables.borderRadius.md} ${variables.borderRadius.md} 0 0`;
    const expected3 = variables.borderRadius.md;
    const expected4 = variables.borderRadius.xs;
    test.each`
      isScheduled | spanAfter | spanBefore | expected
      ${true}     | ${false}  | ${true}    | ${expected1}
      ${true}     | ${true}   | ${false}   | ${expected2}
      ${true}     | ${false}  | ${false}   | ${expected3}
      ${false}    | ${false}  | ${false}   | ${expected4}
    `(
      'isScheduledEvent=$isScheduled, eventSpanAfter=$spanAfter, eventSpanBefore=$spanBefore, expected=$expected',
      ({ isScheduled, spanAfter, spanBefore, expected }) => {
        expect(getBorderRadius(isScheduled, spanAfter, spanBefore)).toBe(expected);
      },
    );
  });

  describe('eventPropGetter', () => {
    const defaultEvent = {
      allDay: false,
      alwaysAvailable: false,
      eventSpanAfter: false,
      eventSpanBefore: false,
      scheduledColor: 'scheduledColor',
      scheduledBackground: 'scheduledBackground',
      backgroundColor: 'backgroundColor',
    };
    const allDayEvent = { ...defaultEvent, allDay: true };
    const alwaysAvailableEvent = { ...defaultEvent, alwaysAvailable: true };
    const defaultExpected = {
      padding: 0,
      color: variables.palette.on_surface,
      borderRadius: variables.borderRadius.xs,
      borderWidth: '0 0 0 0',
      borderColor: 'transparent',
      backgroundColor: 'backgroundColor',
      maxWidth: '96%',
      margin: '0 auto',
    };
    const expected1 = {
      ...defaultExpected,
      borderRadius: variables.borderRadius.md,
      borderWidth: `0 0 0 ${variables.borderWidth.xl}`,
      borderColor: 'scheduledColor',
      backgroundColor: 'scheduledBackground',
      maxWidth: 'unset',
    };
    const expected2 = {
      ...defaultExpected,
      color: variables.palette.white,
    };

    test.each`
      testName                             | eventData               | activeView             | expectedStyles
      ${'Daily event'}                     | ${defaultEvent}         | ${CalendarViews.Day}   | ${expected1}
      ${'Weekly event'}                    | ${defaultEvent}         | ${CalendarViews.Week}  | ${expected1}
      ${'All day event'}                   | ${allDayEvent}          | ${CalendarViews.Week}  | ${defaultExpected}
      ${'Always available event'}          | ${alwaysAvailableEvent} | ${CalendarViews.Week}  | ${expected2}
      ${'Monthly event, not all day'}      | ${defaultEvent}         | ${CalendarViews.Month} | ${defaultExpected}
      ${'Monthly event, all day'}          | ${allDayEvent}          | ${CalendarViews.Month} | ${defaultExpected}
      ${'Monthly event, always available'} | ${alwaysAvailableEvent} | ${CalendarViews.Month} | ${expected2}
      ${'Yearly event, not all day'}       | ${defaultEvent}         | ${CalendarViews.Year}  | ${defaultExpected}
    `(
      'returns correct styles for $testName, active view: $activeView',
      ({ eventData, activeView, expectedStyles }) => {
        const result = eventPropGetter(eventData, activeView);
        const { style } = result;

        expect(style).toEqual(expectedStyles);
      },
    );
  });
});
