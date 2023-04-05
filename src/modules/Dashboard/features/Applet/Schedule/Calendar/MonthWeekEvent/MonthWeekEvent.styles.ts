import { Box, styled } from '@mui/material';

import { shouldForwardProp } from 'shared/utils';
import { theme, variables } from 'shared/styles';
import { StyledEventWrapperTypes } from './MonthWeekEvent.types';

export const StyledEventWrapper = styled(Box, shouldForwardProp)`
  height: 100%;
  width: ${({ eventsNumber, isScheduledWeekEvent }: StyledEventWrapperTypes) =>
    isScheduledWeekEvent
      ? `calc(100% / ${eventsNumber})`
      : `calc(100% / ${eventsNumber} - 1.6rem)`};
  margin: ${({ isScheduledWeekEvent }) => (isScheduledWeekEvent ? 0 : theme.spacing(0, 0.8))};
  background-color: ${({ bgColor }) => bgColor};
  border-radius: ${({ borderRadius }) => borderRadius};
  border: ${({ borderColor }) => `solid ${borderColor}`};
  border-width: ${({ borderWidth }) => borderWidth};
  transition: ${variables.transitions.opacity};

  &:hover {
    opacity: 0.9;
  }
`;
