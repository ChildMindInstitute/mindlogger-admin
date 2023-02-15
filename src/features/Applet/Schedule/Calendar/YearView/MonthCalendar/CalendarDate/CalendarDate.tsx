import { MouseEvent, useState, useRef } from 'react';
import uniqueId from 'lodash.uniqueid';

import theme from 'styles/theme';
import { StyledBodySmall } from 'styles/styledComponents/Typography';
import { StyledHeadline } from 'styles/styledComponents/Typography';
import { Event } from 'features/Applet/Schedule/Calendar/Event';
import {
  formatToYearMonthDate,
  getDayName,
} from 'features/Applet/Schedule/Calendar/Calendar.utils';

import { CalendarDateProps, TooltipPosition } from './CalendarDate.types';
import {
  StyledDayBtn,
  StyledDotsWrapper,
  StyledEventDot,
  StyledTooltipDate,
  StyledTooltip,
  StyledTooltipEventWrapper,
  StyledMonthName,
  StyledMore,
} from './CalendarDate.styles';
import { getMoreEventsText } from './CalendarDate.utils';
import { MAX_EVENTS_IN_TOOLTIP, MAX_ROWS_IN_TOOLTIP, TOOLTIP_HEIGHT } from './CalendarDate.const';

export const CalendarDate = ({
  dateToRender,
  dateOfMonth,
  onDayClick,
  events,
}: CalendarDateProps) => {
  const dayBtnRef = useRef<HTMLButtonElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>(null);

  const open = Boolean(anchorEl);
  const isToday = formatToYearMonthDate(dateToRender) === formatToYearMonthDate(new Date());
  const isOffRange =
    dateToRender.getMonth() < dateOfMonth.getMonth() ||
    dateToRender.getMonth() > dateOfMonth.getMonth();
  const showMoreText = events.length > MAX_ROWS_IN_TOOLTIP;
  const isTooltipBtm = tooltipPosition === 'bottom';

  const handleTooltipOpen = (event: MouseEvent<HTMLButtonElement>) => {
    if (dayBtnRef.current) {
      setTooltipPosition(
        window.innerHeight - dayBtnRef.current.offsetTop - dayBtnRef.current.offsetHeight <
          TOOLTIP_HEIGHT
          ? 'top'
          : 'bottom',
      );
    }
    setAnchorEl(event.currentTarget);
  };

  const handleTooltipClose = () => setAnchorEl(null);

  const eventsRows = events.map(
    (event, index) =>
      ((showMoreText && index < MAX_EVENTS_IN_TOOLTIP) || !showMoreText) && (
        <StyledTooltipEventWrapper key={uniqueId()} bgColor={event.backgroundColor}>
          <Event title={event.title} event={event} />
        </StyledTooltipEventWrapper>
      ),
  );

  return (
    <>
      <StyledDayBtn
        ref={dayBtnRef}
        onMouseEnter={events.length ? handleTooltipOpen : () => false}
        onMouseLeave={events.length ? handleTooltipClose : () => false}
        isToday={isToday}
        isOffRange={isOffRange}
        onClick={() => onDayClick(dateToRender)}
      >
        <StyledBodySmall>{dateToRender.getDate()}</StyledBodySmall>
        {events.length > 0 && (
          <StyledDotsWrapper>
            {events.map(
              ({ allDayEvent, alwaysAvailable, scheduledColor, backgroundColor }, index) =>
                index < 5 && (
                  <StyledEventDot
                    key={uniqueId()}
                    isRounded={!(allDayEvent || alwaysAvailable)}
                    bgColor={scheduledColor || backgroundColor}
                  />
                ),
            )}
          </StyledDotsWrapper>
        )}
      </StyledDayBtn>
      {events.length > 0 && (
        <StyledTooltip
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: isTooltipBtm ? 'bottom' : 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: isTooltipBtm ? 'top' : 'bottom',
            horizontal: 'center',
          }}
          PaperProps={{
            style: {
              marginTop: isTooltipBtm ? theme.spacing(0.4) : theme.spacing(-0.4),
            },
          }}
        >
          <StyledMonthName>{getDayName(dateToRender)}</StyledMonthName>
          <StyledTooltipDate>
            <StyledHeadline>{dateToRender.getDate()}</StyledHeadline>
          </StyledTooltipDate>
          {eventsRows}
          {showMoreText && <StyledMore>{getMoreEventsText(events)}</StyledMore>}
        </StyledTooltip>
      )}
    </>
  );
};
