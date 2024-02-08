import {
  CalendarProps,
  Culture,
  DateLocalizer,
  DateRange,
  EventProps,
  HeaderProps,
  ToolbarProps,
} from 'react-big-calendar';

import { DateFormats } from 'shared/consts';
import { variables } from 'shared/styles/variables';
import { CalendarEvent } from 'modules/Dashboard/state';
import { formatToWeekYear, formatToYearMonthDate, getMoreText } from 'shared/utils/dateFormat';

import { Toolbar } from './Toolbar';
import { MonthHeader } from './MonthHeader';
import { Event, UiType } from './Event';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import {
  CalendarEventWrapperProps,
  CalendarViews,
  GetCalendarComponents,
  GetHasWrapperMoreBtn,
} from './Calendar.types';
import { TimeHeader, UiType as TimeHeaderUiType } from './TimeHeader';
import { TimeGutterHeader } from './TimeGutterHeader';
import { EventWrapper, UiType as EventWrapperUiType } from './EventWrapper';
import { DateHeader } from './DateHeader';
import { EventContainerWrapper } from './EventContainerWrapper';

export const getDefaultStartDate = (date: Date) => {
  const newDate = new Date();

  return date && newDate > date ? newDate : date || undefined;
};

export const getHasWrapperMoreBtn = ({
  activeView,
  date,
  isAllDayEventsVisible,
  allDayEventsSortedByDays,
}: GetHasWrapperMoreBtn) => {
  const currentDate = formatToYearMonthDate(date);
  const currentWeek = formatToWeekYear(date);
  const hasDateHiddenEvents =
    !isAllDayEventsVisible && allDayEventsSortedByDays.some(item => item.date === currentDate);
  const hasDateHiddenEventsWithState = isAllDayEventsVisible?.period === currentDate && !isAllDayEventsVisible?.visible;
  const hasWeekHiddenEvents =
    !isAllDayEventsVisible &&
    allDayEventsSortedByDays.some(item => item.date && formatToWeekYear(new Date(item.date)) === currentWeek);
  const hasWeekHiddenEventsWithState = isAllDayEventsVisible?.period === currentWeek && !isAllDayEventsVisible?.visible;

  switch (activeView) {
    case CalendarViews.Day:
      return hasDateHiddenEvents || hasDateHiddenEventsWithState;
    case CalendarViews.Week:
      return hasWeekHiddenEvents || hasWeekHiddenEventsWithState;
    default:
      return false;
  }
};

export const getCalendarComponents = ({
  activeView,
  setActiveView,
  date,
  setDate,
  events,
  setEvents,
  isAllDayEventsVisible,
  setIsAllDayEventsVisible,
}: GetCalendarComponents) => ({
  components: {
    toolbar: (props: ToolbarProps) => <Toolbar {...props} activeView={activeView} setActiveView={setActiveView} />,
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
      eventContainerWrapper: (props: Partial<CalendarProps>) => <EventContainerWrapper {...props} events={events} />,
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
      eventContainerWrapper: (props: Partial<CalendarProps>) => <EventContainerWrapper {...props} events={events} />,
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

export const getBorderRadius = (isScheduledEvent: boolean, eventSpanAfter: boolean, eventSpanBefore: boolean) => {
  if (isScheduledEvent && eventSpanAfter) {
    return `${variables.borderRadius.md} ${variables.borderRadius.md} 0 0`;
  }
  if (isScheduledEvent && eventSpanBefore) {
    return `0 0 ${variables.borderRadius.md} ${variables.borderRadius.md}`;
  }

  return isScheduledEvent ? variables.borderRadius.md : variables.borderRadius.xs;
};

export const eventPropGetter = (
  {
    allDay,
    alwaysAvailable,
    eventSpanAfter = false,
    eventSpanBefore = false,
    scheduledColor,
    scheduledBackground,
    backgroundColor,
  }: CalendarEvent,
  activeView: CalendarViews,
) => {
  const isAllDayEvent = allDay || alwaysAvailable;
  const isDayEvent = activeView === CalendarViews.Day;
  const isWeekEvent = activeView === CalendarViews.Week;
  const isScheduledTimeEvent = (isDayEvent || isWeekEvent) && !isAllDayEvent;

  return {
    style: {
      padding: 0,
      color: alwaysAvailable ? variables.palette.white : variables.palette.on_surface,
      borderRadius: getBorderRadius(isScheduledTimeEvent, eventSpanAfter, eventSpanBefore),
      borderWidth: `0 0 0 ${isScheduledTimeEvent ? variables.borderWidth.xl : 0}`,
      borderColor: isScheduledTimeEvent ? scheduledColor : 'transparent',
      backgroundColor: isScheduledTimeEvent ? scheduledBackground : backgroundColor,
      maxWidth: isScheduledTimeEvent || isDayEvent ? 'unset' : '96%',
      margin: '0 auto',
    },
  };
};
