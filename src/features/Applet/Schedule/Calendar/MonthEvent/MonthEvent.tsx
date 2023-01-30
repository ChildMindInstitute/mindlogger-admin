import { EventProps } from 'react-big-calendar';

import { Svg } from 'components';
import { StyledLabelMedium } from 'styles/styledComponents/Typography';

import { CalendarEvent } from '../Calendar.types';
import {
  StyledStartIcon,
  StyledEndIcon,
  StyledEvent,
  StyledIndicator,
  StyledTitle,
} from './MonthEvent.styles';

export const MonthEvent = ({ title, event }: EventProps<CalendarEvent>) => {
  const { startIndicator, startFlowIcon, startTime, endAlertIcon, alwaysAvailable } = event;

  return (
    <StyledEvent>
      {startIndicator && <StyledIndicator bgColor={startIndicator} />}
      {startTime && <StyledLabelMedium>{startTime}</StyledLabelMedium>}
      {startFlowIcon && (
        <StyledStartIcon isWhite={alwaysAvailable}>
          <Svg id="flow" width="15" height="15" />
        </StyledStartIcon>
      )}
      <StyledTitle isWhite={alwaysAvailable}>{title}</StyledTitle>
      {endAlertIcon && (
        <StyledEndIcon isWhite={alwaysAvailable}>
          <Svg id="alert" width="10" height="13" />
        </StyledEndIcon>
      )}
    </StyledEvent>
  );
};
