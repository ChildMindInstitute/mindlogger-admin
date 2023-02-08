import { Svg } from 'components';
import { StyledLabelMedium } from 'styles/styledComponents/Typography';

import { EventProps, UiType } from './Event.types';
import {
  StyledEndIcon,
  StyledEvent,
  StyledIndicator,
  StyledLeftSection,
  StyledStartIcon,
  StyledTitle,
} from './Event.styles';

export const Event = ({ title, event, uiType = UiType.Primary }: EventProps) => {
  const { startIndicator, startFlowIcon, startTime, endAlertIcon, alwaysAvailable } = event;

  return (
    <StyledEvent>
      <StyledLeftSection>
        {startIndicator && <StyledIndicator bgColor={startIndicator} />}
        {uiType === UiType.Primary && startTime && (
          <StyledLabelMedium>{startTime}</StyledLabelMedium>
        )}
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
