import { MouseEvent, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import theme from 'styles/theme';
import { StyledBodySmall } from 'styles/styledComponents/Typography';
import { StyledHeadline } from 'styles/styledComponents/Typography';

import { MonthEvent } from '../../../MonthEvent';
import { formatToYearMonthDate } from '../../../Calendar.utils';
import { CalendarDateProps } from './CalendarDate.types';
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
import { getDayName } from './CalendarDate.utils';

export const CalendarDate = ({ dateToRender, dateOfMonth, onClick, events }: CalendarDateProps) => {
  const { t } = useTranslation();
  const dayBtnRef = useRef<HTMLButtonElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<'bottom' | 'top' | null>(null);

  const open = Boolean(anchorEl);
  const isToday = formatToYearMonthDate(dateToRender) === formatToYearMonthDate(new Date());
  const isOffRange =
    dateToRender.getMonth() < dateOfMonth.getMonth() ||
    dateToRender.getMonth() > dateOfMonth.getMonth();
  const showMoreText = events.length > 10;
  const isTooltipBtm = tooltipPosition === 'bottom';

  const handleTooltipOpen = (event: MouseEvent<HTMLButtonElement>) => {
    if (dayBtnRef.current) {
      setTooltipPosition(
        window.innerHeight - dayBtnRef.current.offsetTop - dayBtnRef.current.offsetHeight < 410
          ? 'top'
          : 'bottom',
      );
    }
    setAnchorEl(event.currentTarget);
  };

  const handleTooltipClose = () => setAnchorEl(null);

  const getEventsRows = () =>
    events.map(
      (event, index) =>
        ((showMoreText && index < 9) || !showMoreText) && (
          <StyledTooltipEventWrapper key={index} bgColor={event.backgroundColor}>
            <MonthEvent title={event.title} event={event} />
          </StyledTooltipEventWrapper>
        ),
    );

  return (
    <>
      <StyledDayBtn
        ref={dayBtnRef}
        onMouseEnter={events.length > 0 ? handleTooltipOpen : () => false}
        onMouseLeave={events.length > 0 ? handleTooltipClose : () => false}
        isToday={isToday}
        isOffRange={isOffRange}
        onClick={() => onClick(dateToRender)}
      >
        <StyledBodySmall>{dateToRender.getDate()}</StyledBodySmall>
        {events.length > 0 && (
          <StyledDotsWrapper>
            {events.map(
              (event, index) =>
                index < 5 && (
                  <StyledEventDot
                    key={index}
                    isRounded={!!event.startIndicator}
                    bgColor={event.startIndicator ? event.startIndicator : event.backgroundColor}
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
          sx={{
            pointerEvents: 'none',
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
          {getEventsRows()}
          {showMoreText && (
            <StyledMore>{`${events.length - 9} ${t('more').toLowerCase()}...`}</StyledMore>
          )}
        </StyledTooltip>
      )}
    </>
  );
};
