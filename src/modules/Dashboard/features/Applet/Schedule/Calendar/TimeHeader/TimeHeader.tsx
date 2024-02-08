import { MouseEvent } from 'react';

import { variables, StyledLabelBoldMedium, StyledTitleLarge } from 'shared/styles';
import {
  formatToWeekYear,
  formatToYearMonthDate,
  getDayName,
  getMonthName,
  getMoreText,
} from 'shared/utils/dateFormat';
import { calendarEvents } from 'modules/Dashboard/state';

import { NameLength } from '../Calendar.types';
import { TimeHeaderProps, UiType } from './TimeHeader.types';
import { StyledMore, StyledWeekDayWrapper } from './TimeHeader.styles';

export const TimeHeader = ({
  date,
  isAllDayEventsVisible,
  setIsAllDayEventsVisible,
  setEvents,
  uiType,
}: TimeHeaderProps) => {
  const VISIBLE_EVENTS_LENGTH = 3;
  const currentDate = formatToYearMonthDate(date);
  const currentWeek = formatToWeekYear(date);
  const { hiddenEventsIds = [], allDayEventsSortedByDays = [] } = calendarEvents.useVisibleEventsData() || {};
  const currentAllDaysEventsIds = allDayEventsSortedByDays?.find(el => el.date === currentDate)?.eventsIds;
  const isWeekUiType = uiType === UiType.Week;
  const isDayUiType = uiType === UiType.Day;

  const weekIsShowMoreVisible =
    isWeekUiType &&
    ((currentAllDaysEventsIds && isAllDayEventsVisible?.period !== currentWeek) ||
      (isAllDayEventsVisible?.period === currentWeek && isAllDayEventsVisible?.visible === false));

  const dayIsShowMoreVisible =
    isDayUiType &&
    ((currentAllDaysEventsIds && isAllDayEventsVisible?.period !== currentDate) ||
      (isAllDayEventsVisible?.period === currentDate && isAllDayEventsVisible?.visible === false));

  const isShowMoreVisible = weekIsShowMoreVisible || dayIsShowMoreVisible;

  const handleMoreClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    setEvents(prevState =>
      prevState.map(event => {
        if (
          (isWeekUiType && formatToWeekYear(event.start) === currentWeek) ||
          (isDayUiType && formatToYearMonthDate(event.start) === currentDate)
        ) {
          return {
            ...event,
            isHiddenInTimeView: false,
          };
        }

        return {
          ...event,
          isHiddenInTimeView: hiddenEventsIds?.some(id => id === event.id),
        };
      }),
    );
    setIsAllDayEventsVisible({
      period: isWeekUiType ? currentWeek : currentDate,
      visible: true,
    });
  };

  return (
    <>
      {isWeekUiType && (
        <StyledWeekDayWrapper component="span">
          <StyledLabelBoldMedium className="day-name" color={variables.palette.on_surface_variant}>
            {getDayName(date).toUpperCase()}
          </StyledLabelBoldMedium>
          <StyledTitleLarge className="date" color={variables.palette.on_surface_variant}>{`${
            date.getDate() === 1 ? `${getMonthName(date, NameLength.Short)} ` : ''
          }${date.getDate()}`}</StyledTitleLarge>
        </StyledWeekDayWrapper>
      )}
      {isShowMoreVisible && (
        <StyledMore isWeekType={isWeekUiType} onClick={handleMoreClick}>
          {currentAllDaysEventsIds && `${currentAllDaysEventsIds.length - VISIBLE_EVENTS_LENGTH} ${getMoreText()}`}
        </StyledMore>
      )}
    </>
  );
};
