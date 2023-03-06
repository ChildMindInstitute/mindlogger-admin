import { Dispatch, SetStateAction } from 'react';
import {
  CalendarProps,
  Culture,
  DateLocalizer,
  DateRange,
  EventProps,
  HeaderProps,
  ToolbarProps,
} from 'react-big-calendar';
import { format, getISOWeek } from 'date-fns';

import { DateFormats } from 'consts';
import i18n from 'i18n';
import { variables } from 'styles/variables';

import { UiType } from './Event/Event.types';
import { Toolbar } from './Toolbar';
import { MonthHeader } from './MonthHeader';
import { Event } from './Event';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import {
  AllDayEventsSortedByDaysItem,
  AllDayEventsVisible,
  CalendarEvent,
  CalendarEventWrapperProps,
  CalendarViews,
  NameLength,
} from './Calendar.types';
import {
  LENGTH_TO_FILTER_DAYS_EVENTS,
  LENGTH_TO_SET_ID_IS_HIDDEN,
  mockedEvents,
} from './Calendar.const';
import { TimeHeader, UiType as TimeHeaderUiType } from './TimeHeader';
import { TimeGutterHeader } from './TimeGutterHeader';
import { EventWrapper } from './EventWrapper';
import { DateHeader } from './DateHeader';
import { EventContainerWrapper } from './EventContainerWrapper';
import { UiType as EventWrapperUiType } from './EventWrapper';

const { t } = i18n;

export const getEventEndTime = (date: Date) =>
  ` - ${
    format(date, DateFormats.TimeSeconds) === '23:59:59' ||
    format(date, DateFormats.TimeSeconds) === '00:00:00'
      ? '24:00'
      : format(date, DateFormats.Time)
  }`;

export const getMoreText = () => `${t('more').toLowerCase()}...`;

export const formatToYearMonthDate = (date: Date) => format(date, DateFormats.DayMonthYear);

export const formatToWeekYear = (date: Date) => `${getISOWeek(date)} ${date.getFullYear()}`;

const notHiddenEvents = mockedEvents.filter((event) => !event.isHidden);

const allDayEventsSortedByDaysMap = notHiddenEvents.reduce(
  (acc: Map<string, AllDayEventsSortedByDaysItem>, el) => {
    const currentEventStartDate = formatToYearMonthDate(el.start);
    const currentEventWeek = formatToWeekYear(el.start);
    const eventsIds = acc.get(currentEventStartDate)?.eventsIds;
    if (el.allDayEvent || el.alwaysAvailable) {
      acc.set(currentEventStartDate, {
        eventsIds:
          eventsIds && acc.has(currentEventStartDate)
            ? [
                ...eventsIds,
                {
                  id: el.id,
                  isHiddenInTimeView: eventsIds.length > LENGTH_TO_SET_ID_IS_HIDDEN,
                },
              ]
            : [{ id: el.id, isHiddenInTimeView: false }],
        week: currentEventWeek,
        date: currentEventStartDate,
      });
    }

    return acc;
  },
  new Map(),
);

export const allDayEventsSortedByDays = Array.from(allDayEventsSortedByDaysMap.values()).filter(
  (el) => el.eventsIds.length > LENGTH_TO_FILTER_DAYS_EVENTS,
);

export const hiddenEventsIds = allDayEventsSortedByDays.reduce((acc: string[], item) => {
  item.eventsIds.forEach((el) => el.isHiddenInTimeView && acc.push(el.id));

  return acc;
}, []);

export const getProcessedEvents = (date: Date) =>
  notHiddenEvents.map((event) => ({
    ...event,
    isOffRange: event.start.getMonth() !== date.getMonth(),
    isHiddenInTimeView: hiddenEventsIds.some((id) => id === event.id),
  }));

export const getHasWrapperMoreBtn = (
  activeView: CalendarViews,
  events: CalendarEvent[],
  date: Date,
  isAllDayEventsVisible: AllDayEventsVisible,
) => {
  const currentDate = formatToYearMonthDate(date);
  const currentWeek = formatToWeekYear(date);
  const hasDateHiddenEvents =
    !isAllDayEventsVisible && allDayEventsSortedByDays.some((item) => item.date === currentDate);
  const hasDateHiddenEventsWithState =
    isAllDayEventsVisible?.period === currentDate && !isAllDayEventsVisible?.visible;
  const hasWeekHiddenEvents =
    !isAllDayEventsVisible &&
    allDayEventsSortedByDays.some(
      (item) => item.date && formatToWeekYear(new Date(item.date)) === currentWeek,
    );
  const hasWeekHiddenEventsWithState =
    isAllDayEventsVisible?.period === currentWeek && !isAllDayEventsVisible?.visible;

  switch (activeView) {
    case CalendarViews.Day:
      return hasDateHiddenEvents || hasDateHiddenEventsWithState;
    case CalendarViews.Week:
      return hasWeekHiddenEvents || hasWeekHiddenEventsWithState;
    default:
      return false;
  }
};

export const getDayName = (date: Date) =>
  date.toLocaleDateString(i18n.language, { weekday: NameLength.Long });

export const getMonthName = (date: Date, length?: NameLength) =>
  date.toLocaleString(i18n.language, { month: length || NameLength.Long });

export const getCalendarComponents = (
  activeView: CalendarViews,
  setActiveView: Dispatch<SetStateAction<CalendarViews>>,
  date: Date,
  setDate: Dispatch<SetStateAction<Date>>,
  events: CalendarEvent[],
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>,
  isAllDayEventsVisible: AllDayEventsVisible,
  setIsAllDayEventsVisible: Dispatch<SetStateAction<AllDayEventsVisible>>,
) => ({
  components: {
    toolbar: (props: ToolbarProps) => (
      <Toolbar {...props} activeView={activeView} setActiveView={setActiveView} />
    ),
    month: {
      dateHeader: DateHeader,
      header: (props: HeaderProps) => <MonthHeader {...props} calendarDate={date} />,
      event: Event,
      eventWrapper: (props: CalendarEventWrapperProps) => (
        <EventWrapper {...props} uiType={EventWrapperUiType.MonthView}>
          {props.children}
        </EventWrapper>
      ),
    },
    week: {
      header: (props: HeaderProps) => (
        <TimeHeader
          {...props}
          isAllDayEventsVisible={isAllDayEventsVisible}
          setIsAllDayEventsVisible={setIsAllDayEventsVisible}
          setEvents={setEvents}
          uiType={TimeHeaderUiType.Week}
        />
      ),
      eventContainerWrapper: (props: Partial<CalendarProps>) => (
        <EventContainerWrapper {...props} events={events} />
      ),
      eventWrapper: EventWrapper,
      event: (props: EventProps<CalendarEvent>) => <Event {...props} uiType={UiType.TimeView} />,
    },
    day: {
      header: (props: HeaderProps) => (
        <TimeHeader
          {...props}
          isAllDayEventsVisible={isAllDayEventsVisible}
          setIsAllDayEventsVisible={setIsAllDayEventsVisible}
          setEvents={setEvents}
          uiType={TimeHeaderUiType.Day}
        />
      ),
      eventContainerWrapper: (props: Partial<CalendarProps>) => (
        <EventContainerWrapper {...props} events={events} />
      ),
      eventWrapper: EventWrapper,
      event: (props: EventProps<CalendarEvent>) => <Event {...props} uiType={UiType.TimeView} />,
    },
    timeGutterHeader: () => (
      <TimeGutterHeader
        date={date}
        isAllDayEventsVisible={isAllDayEventsVisible}
        setIsAllDayEventsVisible={setIsAllDayEventsVisible}
        setEvents={setEvents}
        activeView={activeView}
      />
    ),
    date,
    setDate,
    activeView,
    setActiveView,
    isAllDayEventsVisible,
  },
  messages: {
    showMore: (total: number) => `${total} ${getMoreText()}`,
  },
  views: {
    month: MonthView,
    day: true,
    week: true,
    year: YearView,
  },
  formats: {
    dayHeaderFormat: (date: Date, culture?: Culture, localizer?: DateLocalizer) =>
      localizer?.format(date, DateFormats.FullWeekDayFullMonthYear, culture),
    dayRangeHeaderFormat: (range: DateRange, culture?: Culture, localizer?: DateLocalizer) =>
      `${localizer?.format(range.start, DateFormats.DayFullMonth, culture)} - ${localizer?.format(
        range.end,
        DateFormats.DayFullMonthYear,
        culture,
      )}`,
    timeGutterFormat: (date: Date, culture?: Culture, localizer?: DateLocalizer) =>
      localizer?.format(date, DateFormats.Time, culture),
  },
});

export const eventPropGetter = (
  {
    allDayEvent,
    alwaysAvailable,
    eventSpanAfter,
    eventSpanBefore,
    scheduledColor,
    scheduledBackground,
    backgroundColor,
  }: CalendarEvent,
  activeView: CalendarViews,
) => {
  const isAllDayEvent = allDayEvent || alwaysAvailable;
  const isTimeView = activeView === CalendarViews.Day || activeView === CalendarViews.Week;
  const isScheduledDayWeekEvent = isTimeView && !isAllDayEvent;

  const getBorderRadius = () => {
    if (isScheduledDayWeekEvent && eventSpanAfter) {
      return `${variables.borderRadius.md} ${variables.borderRadius.md} 0 0`;
    }
    if (isScheduledDayWeekEvent && eventSpanBefore) {
      return `0 0 ${variables.borderRadius.md} ${variables.borderRadius.md}`;
    }

    return isScheduledDayWeekEvent ? variables.borderRadius.md : variables.borderRadius.xs;
  };

  return {
    style: {
      padding: 0,
      borderRadius: getBorderRadius(),
      borderWidth: `0 0 0 ${isScheduledDayWeekEvent ? variables.borderWidth.xl : 0}`,
      borderColor: isScheduledDayWeekEvent ? scheduledColor : 'transparent',
      backgroundColor: (isScheduledDayWeekEvent && scheduledBackground) || backgroundColor,
      color: alwaysAvailable ? variables.palette.white : variables.palette.on_surface,
    },
  };
};
