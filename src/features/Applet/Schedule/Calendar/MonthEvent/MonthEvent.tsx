import { Svg } from 'components';
import { StyledLabelMedium } from 'styles/styledComponents/Typography';

import { MonthEventProps } from './MonthEvent.types';
import {
  StyledStartIcon,
  StyledEndIcon,
  StyledEvent,
  StyledIndicator,
  StyledTitle,
  StyledLeftSection,
} from './MonthEvent.styles';

export const MonthEvent = ({ title, event }: MonthEventProps) => {
  const { startIndicator, startFlowIcon, startTime, endAlertIcon, alwaysAvailable } = event;

  return (
    <StyledEvent>
      <StyledLeftSection>
        {startIndicator && <StyledIndicator bgColor={startIndicator} />}
        {startTime && <StyledLabelMedium>{startTime}</StyledLabelMedium>}
        {startFlowIcon && (
          <StyledStartIcon isWhite={alwaysAvailable}>
            <Svg id="flow" width="15" height="15" />
          </StyledStartIcon>
        )}
        <StyledTitle isWhite={alwaysAvailable}>{title}</StyledTitle>
      </StyledLeftSection>
      {endAlertIcon && (
        <StyledEndIcon isWhite={alwaysAvailable}>
          <Svg id="alert" width="10" height="13" />
        </StyledEndIcon>
      )}
    </StyledEvent>
  );
};
