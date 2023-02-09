import { format } from 'date-fns';

import { Svg } from 'components';
import { DateFormats } from 'consts';
import { variables } from 'styles/variables';
import {
  StyledBodySmall,
  StyledLabelBoldMedium,
  StyledLabelMedium,
} from 'styles/styledComponents/Typography';

import { EventProps, UiType } from './Event.types';
import {
  StyledEndIcon,
  StyledEvent,
  StyledIndicator,
  StyledLeftSection,
  StyledStartIcon,
  StyledTitle,
  StyledTopWrapper,
} from './Event.styles';

export const Event = ({ title, event, uiType = UiType.Primary }: EventProps) => {
  const { scheduledColor, startFlowIcon, start, end, allDayEvent, endAlertIcon, alwaysAvailable } =
    event;
  const isAllDayEvent = allDayEvent || alwaysAvailable;

  return (
    <StyledEvent>
      <StyledTopWrapper>
        <StyledLeftSection>
          {uiType === UiType.Primary && scheduledColor && (
            <StyledIndicator bgColor={scheduledColor} />
          )}
          {uiType === UiType.Primary && !isAllDayEvent && (
            <StyledLabelMedium>{format(start, DateFormats.Time)}</StyledLabelMedium>
          )}
          {uiType === UiType.Secondary && !isAllDayEvent && (
            <StyledBodySmall>{`${format(start, DateFormats.Time)} - ${format(
              end,
              DateFormats.Time,
            )}`}</StyledBodySmall>
          )}
          {startFlowIcon && (
            <StyledStartIcon isWhite={alwaysAvailable}>
              <Svg id="flow" width="15" height="15" />
            </StyledStartIcon>
          )}
          {(uiType === UiType.Primary || allDayEvent) && (
            <StyledTitle isWhite={alwaysAvailable}>{title}</StyledTitle>
          )}
        </StyledLeftSection>
        {endAlertIcon && (
          <StyledEndIcon isWhite={alwaysAvailable}>
            <Svg id="alert" width="10" height="13" />
          </StyledEndIcon>
        )}
      </StyledTopWrapper>
      {uiType === UiType.Secondary && !isAllDayEvent && (
        <StyledLabelBoldMedium color={variables.palette.on_surface}>{title}</StyledLabelBoldMedium>
      )}
    </StyledEvent>
  );
};
