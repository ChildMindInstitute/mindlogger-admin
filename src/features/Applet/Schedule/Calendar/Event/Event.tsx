import { format } from 'date-fns';

import { Svg } from 'components';
import { DateFormats } from 'consts';
import theme from 'styles/theme';
import { StyledBodySmall, StyledLabelMedium } from 'styles/styledComponents';

import { EventProps, UiType } from './Event.types';
import {
  StyledEndIcon,
  StyledEvent,
  StyledIndicator,
  StyledLeftSection,
  StyledStartIcon,
  StyledTitle,
  StyledWrapper,
} from './Event.styles';
import { getEventEndTime } from './Event.utils';

export const Event = ({ title, event, uiType = UiType.MonthView }: EventProps) => {
  const { scheduledColor, startFlowIcon, start, end, allDayEvent, endAlertIcon, alwaysAvailable } =
    event;
  const isAllDayEvent = allDayEvent || alwaysAvailable;
  const isMonthView = uiType === UiType.MonthView;
  const isTimeView = uiType === UiType.TimeView;
  const isScheduledDayWeekEvent = isTimeView && !isAllDayEvent;

  return (
    <StyledEvent className="event" isScheduledDayWeekEvent={isScheduledDayWeekEvent}>
      <StyledWrapper className="event-top-section">
        <StyledLeftSection>
          {isMonthView && scheduledColor && <StyledIndicator bgColor={scheduledColor} />}
          {isMonthView && !isAllDayEvent && (
            <StyledLabelMedium>{format(start, DateFormats.Time)}</StyledLabelMedium>
          )}
          {isTimeView && !isAllDayEvent && (
            <>
              <StyledBodySmall className="event-start-time" sx={{ flexShrink: 0 }}>
                {format(start, DateFormats.Time)}
              </StyledBodySmall>
              <StyledBodySmall className="event-end-time" sx={{ flexShrink: 0 }}>
                {getEventEndTime(end)}
              </StyledBodySmall>
            </>
          )}
          {startFlowIcon && (
            <StyledStartIcon className="event-flow-top" isWhite={alwaysAvailable}>
              <Svg id="flow" width="15" height="15" />
            </StyledStartIcon>
          )}
          <StyledTitle className="event-title-top" isWhite={alwaysAvailable}>
            {title}
          </StyledTitle>
        </StyledLeftSection>
        {endAlertIcon && (
          <StyledEndIcon className="event-alert-top" isWhite={alwaysAvailable}>
            <Svg id="alert" width="10" height="13" />
          </StyledEndIcon>
        )}
      </StyledWrapper>
      {isTimeView && !isAllDayEvent && (
        <StyledWrapper className="event-bottom-section">
          <StyledLeftSection>
            {startFlowIcon && (
              <StyledStartIcon sx={{ mr: theme.spacing(0.5) }} isWhite={alwaysAvailable}>
                <Svg id="flow" width="15" height="15" />
              </StyledStartIcon>
            )}
            <StyledTitle className="event-title-bottom">{title}</StyledTitle>
          </StyledLeftSection>
          {endAlertIcon && (
            <StyledEndIcon className="event-alert-bottom" isWhite={alwaysAvailable}>
              <Svg id="alert" width="10" height="13" />
            </StyledEndIcon>
          )}
        </StyledWrapper>
      )}
    </StyledEvent>
  );
};
