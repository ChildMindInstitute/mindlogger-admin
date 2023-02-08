import { Dispatch, SetStateAction } from 'react';
import { Culture, DateLocalizer, DateRange, HeaderProps, ToolbarProps } from 'react-big-calendar';
import { format } from 'date-fns';

import { Svg } from 'components';
import i18n from 'i18n';
import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledLabelBoldMedium } from 'styles/styledComponents/Typography';
import { DateFormats } from 'consts';

import { Toolbar } from './Toolbar';
import { MonthHeader } from './MonthHeader';
import { MonthEvent } from './MonthEvent';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import { CalendarEvent, CalendarViews } from './Calendar.types';
import { StyledTimeHeaderGutter } from './Calendar.styles';

const { t } = i18n;

export const getCalendarComponents = (
  activeView: string,
  setActiveView: Dispatch<SetStateAction<CalendarViews>>,
  date: Date,
  setDate: Dispatch<SetStateAction<Date>>,
) => ({
  components: {
    toolbar: (props: ToolbarProps) => (
      <Toolbar {...props} activeView={activeView} setActiveView={setActiveView} />
    ),
    month: {
      header: (props: HeaderProps) => <MonthHeader {...props} calendarDate={date} />,
      event: MonthEvent,
    },
    // day: {
    //   event: DayEvent,
    // },
    timeGutterHeader: () => (
      <StyledTimeHeaderGutter>
        <Svg id="navigate-right" width="19" height="19" />
        <StyledLabelBoldMedium sx={{ ml: theme.spacing(0.7) }} color={variables.palette.outline}>
          {t('allDay')}
        </StyledLabelBoldMedium>
      </StyledTimeHeaderGutter>
    ),
    setDate,
    setActiveView,
    date,
    activeView,
  },
  messages: {
    showMore: (total: number) => `${total} ${t('more').toLowerCase()}...`,
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

export const eventPropGetter = (event: CalendarEvent) => ({
  style: {
    backgroundColor: event.backgroundColor,
    color: event.alwaysAvailable ? variables.palette.white : variables.palette.on_surface,
    ...(event.isOffRange && { opacity: '0.38' }),
  },
});

export const getEventsWithOffRange = (events: CalendarEvent[], date: Date) =>
  events.map((event) => ({
    ...event,
    isOffRange: event.start.getMonth() !== date.getMonth(),
  }));

export const formatToYearMonthDate = (date?: Date) =>
  date && format(date, DateFormats.DayMonthYear);
