import { Dispatch, SetStateAction } from 'react';
import {
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
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { UiType } from './Event/Event.types';
import { Toolbar } from './Toolbar';
import { MonthHeader } from './MonthHeader';
import { Event } from './Event';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import { AllDayEventsVisible, CalendarEvent, CalendarViews } from './Calendar.types';
import { LENGTH_TO_SET_ID_IS_HIDDEN, mockedEvents } from './Calendar.const';
import { TimeHeader, UiType as TimeHeaderUiType } from './TimeHeader';
import { TimeGutterHeader } from './TimeGutterHeader';
import { EventWrapper } from './EventWrapper';
import { DateHeader } from './DateHeader';

const { t } = i18n;

export const getMoreText = () => `${t('more').toLowerCase()}...`;

export const formatToYearMonthDate = (date?: Date) =>
  date && format(date, DateFormats.DayMonthYear);

export const formatToWeekYear = (date: Date) => `${getISOWeek(date)} ${date.getFullYear()}`;

// TODO: Reformat the logic when connecting to the API
export const allDayEventsSortedByDays = mockedEvents
  .reduce(
    (
      acc: { date: string | undefined; eventsIds: { id: string; isHidden: boolean }[] }[],
      event,
    ) => {
      const currentEventStartDate = formatToYearMonthDate(event.start);
      if (event.allDayEvent || event.alwaysAvailable) {
        if (acc.some((el) => el.date === currentEventStartDate)) {
          acc.map((el) => {
            if (el.date === currentEventStartDate) {
              const ids = el.eventsIds;

              return {
                ...el,
                eventsIds: ids.push({
                  id: event.id,
                  isHidden: ids.length > LENGTH_TO_SET_ID_IS_HIDDEN,
                }),
              };
            }

            return el;
          });
        } else {
          acc.push({
            date: currentEventStartDate,
            eventsIds: [{ id: event.id, isHidden: false }],
          });
        }
      }

      return acc;
    },
    [],
  )
  .filter((el) => el.eventsIds.length > 4);

export const hiddenEventsIds = allDayEventsSortedByDays.reduce((acc: string[], item) => {
  item.eventsIds.forEach((el) => el.isHidden && acc.push(el.id));

  return acc;
}, []);

export const getProcessedEvents = (date: Date) =>
  mockedEvents.map((event) => ({
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
  date.toLocaleDateString(i18n.language, { weekday: 'long' });

export const getMonthName = (date: Date, length?: 'long' | 'short') =>
  date.toLocaleString(i18n.language, { month: length || 'long' });

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
    },
    week: {
      eventWrapper: EventWrapper,
      event: (props: EventProps<CalendarEvent>) => <Event {...props} uiType={UiType.Secondary} />,
      header: (props: HeaderProps) => (
        <TimeHeader
          {...props}
          isAllDayEventsVisible={isAllDayEventsVisible}
          setIsAllDayEventsVisible={setIsAllDayEventsVisible}
          setEvents={setEvents}
          uiType={TimeHeaderUiType.Week}
        />
      ),
    },
    day: {
      eventWrapper: EventWrapper,
      event: (props: EventProps<CalendarEvent>) => <Event {...props} uiType={UiType.Secondary} />,
      header: (props: HeaderProps) => (
        <TimeHeader
          {...props}
          isAllDayEventsVisible={isAllDayEventsVisible}
          setIsAllDayEventsVisible={setIsAllDayEventsVisible}
          setEvents={setEvents}
          uiType={TimeHeaderUiType.Day}
        />
      ),
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

export const eventPropGetter = (event: CalendarEvent, activeView: CalendarViews) => {
  const isAllDayEvent = event.allDayEvent || event.alwaysAvailable;
  const isDayWeekView = activeView === CalendarViews.Day || activeView === CalendarViews.Week;
  const isScheduledDayWeekEvent = isDayWeekView && !isAllDayEvent;

  return {
    style: {
      padding: isScheduledDayWeekEvent ? theme.spacing(0.2, 0.8) : theme.spacing(0.2, 0.4),
      borderRadius: isScheduledDayWeekEvent ? variables.borderRadius.md : variables.borderRadius.xs,
      borderWidth: `0 0 0 ${isScheduledDayWeekEvent ? variables.borderWidth.xl : 0}`,
      borderColor: isScheduledDayWeekEvent ? event.scheduledColor : 'transparent',
      backgroundColor:
        (isScheduledDayWeekEvent && event.scheduledBackground) || event.backgroundColor,
      color: event.alwaysAvailable ? variables.palette.white : variables.palette.on_surface,
      ...(event.isOffRange && { opacity: '0.38' }),
    },
  };
};
