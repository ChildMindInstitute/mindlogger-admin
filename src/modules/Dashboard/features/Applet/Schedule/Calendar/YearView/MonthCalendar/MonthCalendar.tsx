import { useEffect, useMemo, useState } from 'react';
import uniqueId from 'lodash.uniqueid';
import { isWithinInterval, subSeconds } from 'date-fns';

import i18n from 'i18n';
import { CalendarEvent } from 'modules/Dashboard/state';
import {
  formatToYearMonthDate,
  getMonthName,
} from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.utils';

import { CalendarViews } from '../../Calendar.types';
import { CalendarDate } from './CalendarDate';
import { createCalendar, shortWeekDaysArray } from './MonthCalendar.utils';
import { MonthCalendarProps, MonthObject } from './MonthCalendar.types';
import {
  StyledMonth,
  StyledMonthName,
  StyledDay,
  StyledDaysWrapper,
  StyledMonthInside,
} from './MonthCalendar.styles';

export const MonthCalendar = ({
  date,
  events,
  localizer,
  setDate,
  setActiveView,
}: MonthCalendarProps) => {
  const langLocale = i18n.language;
  const [calendar, setCalendar] = useState<MonthObject | null>(null);

  const handleDayClick = (date: Date) => {
    setDate(date);
    setActiveView(CalendarViews.Day);
  };

  const monthDates = useMemo(
    () =>
      calendar &&
      calendar.weeks.map((week, index) => (
        <StyledDaysWrapper key={index}>
          {week.map((date, index) => {
            const currentDateEvents = events?.filter(
              ({ start, end }) =>
                (start && formatToYearMonthDate(start) === formatToYearMonthDate(date)) ||
                (start &&
                  end &&
                  end > start &&
                  isWithinInterval(date, {
                    start,
                    end: subSeconds(end, 1),
                  })),
            );

            return (
              <CalendarDate
                key={index}
                dateToRender={date}
                dateOfMonth={calendar.date}
                onDayClick={handleDayClick}
                events={currentDateEvents as CalendarEvent[]}
              />
            );
          })}
        </StyledDaysWrapper>
      )),
    [calendar, events],
  );

  useEffect(() => {
    date && setCalendar(createCalendar(date, localizer));
  }, [date]);

  return (
    calendar && (
      <StyledMonth>
        <StyledMonthInside>
          <StyledMonthName>{getMonthName(calendar.date)}</StyledMonthName>
          <StyledDaysWrapper>
            {shortWeekDaysArray(langLocale).map((day) => (
              <StyledDay key={uniqueId()}>{day}</StyledDay>
            ))}
          </StyledDaysWrapper>
          {monthDates}
        </StyledMonthInside>
      </StyledMonth>
    )
  );
};
