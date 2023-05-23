import { useEffect, useMemo, useState } from 'react';

import i18n from 'i18n';
import { CalendarEvent } from 'modules/Dashboard/state';
import {
  formatToYearMonthDate,
  getMonthName,
} from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.utils';
import { StyledFlexSpaceBetween } from 'shared/styles';

import { CalendarViews } from '../../Calendar.types';
import { CalendarDate } from './CalendarDate';
import { createCalendar, shortWeekDaysArray } from './MonthCalendar.utils';
import { MonthCalendarProps, MonthObject } from './MonthCalendar.types';
import {
  StyledMonth,
  StyledMonthName,
  StyledDay,
  StyledMonthInside,
  StyledSkeleton,
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
        <StyledFlexSpaceBetween key={index}>
          {week.map((date, index) => {
            const currentDateEvents = events?.filter(
              ({ eventCurrentDate }) => eventCurrentDate === formatToYearMonthDate(date),
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
        </StyledFlexSpaceBetween>
      )),
    [calendar, events],
  );

  useEffect(() => {
    date && setCalendar(createCalendar(date, localizer));
  }, [date]);

  return (
    <StyledMonth>
      <StyledMonthInside>
        {calendar && monthDates ? (
          <>
            <StyledMonthName>{getMonthName(calendar.date)}</StyledMonthName>
            <StyledFlexSpaceBetween>
              {shortWeekDaysArray(langLocale).map(({ id, name }) => (
                <StyledDay key={id}>{name}</StyledDay>
              ))}
            </StyledFlexSpaceBetween>
            {monthDates}
          </>
        ) : (
          <StyledSkeleton animation="wave" variant="rectangular" width={224} height={180} />
        )}
      </StyledMonthInside>
    </StyledMonth>
  );
};
