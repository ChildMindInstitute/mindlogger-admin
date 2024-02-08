import { format } from 'date-fns';

import { Svg } from 'shared/components/Svg';
import { DateFormats } from 'shared/consts';
import { theme, StyledBodySmall, StyledLabelMedium, variables } from 'shared/styles';

import {
  StyledEndIcon,
  StyledEvent,
  StyledIndicator,
  StyledLeftSection,
  StyledStartIcon,
  StyledTitle,
  StyledWrapper,
} from './Event.styles';
import { EventProps, UiType } from './Event.types';

export const Event = ({ title, event, uiType = UiType.DefaultView }: EventProps) => {
  const {
    scheduledColor,
    startFlowIcon,
    start,
    end,
    allDay,
    endAlertIcon,
    alwaysAvailable,
    isOffRange,
    startTime,
    endTime,
  } = event;
  const isAllDayEvent = allDay || alwaysAvailable;
  const isDefaultView = uiType === UiType.DefaultView;
  const isTimeView = uiType === UiType.TimeView;
  const isScheduledDayWeekEvent = isTimeView && !isAllDayEvent;

  return (
    <StyledEvent
      sx={{ opacity: isOffRange && isDefaultView ? variables.opacity.disabled : 1 }}
      title=""
      className="event"
      isScheduledDayWeekEvent={isScheduledDayWeekEvent}>
      <StyledWrapper className="event-top-section">
        <StyledLeftSection>
          {!isAllDayEvent && isDefaultView && scheduledColor && <StyledIndicator bgColor={scheduledColor} />}
          {isDefaultView && !isAllDayEvent && <StyledLabelMedium>{startTime}</StyledLabelMedium>}
          {isTimeView && !isAllDayEvent && (
            <>
              <StyledBodySmall className="event-start-time" sx={{ flexShrink: 0 }}>
                {startTime ?? format(start, DateFormats.Time)}
              </StyledBodySmall>
              <StyledBodySmall className="event-end-time" sx={{ flexShrink: 0 }}>
                - {endTime ?? format(end, DateFormats.Time)}
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
