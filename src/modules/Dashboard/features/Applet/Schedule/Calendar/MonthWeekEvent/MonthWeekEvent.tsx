import { eachDayOfInterval, subDays } from 'date-fns';
import uniqueId from 'lodash.uniqueid';

import { StyledFlexTopCenter, variables } from 'shared/styles';
import { getBorderRadius } from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.utils';

import { Event, UiType } from '../Event';
import { CalendarViews } from '../Calendar.types';
import { MonthWeekEventProps } from './MonthWeekEvent.types';
import { StyledEventWrapper } from './MonthWeekEvent.styles';

export const MonthWeekEvent = ({
  title,
  event,
  slotStart,
  slotEnd,
  uiType = UiType.DefaultView,
  activeView,
  ...props
}: MonthWeekEventProps) => {
  const {
    backgroundColor,
    scheduledBackground = '',
    scheduledColor = '',
    allDay,
    alwaysAvailable,
    eventSpanBefore = false,
    eventSpanAfter = false,
  } = event;
  const isAllDayEvent = allDay || alwaysAvailable;
  const isScheduledWeekEvent = activeView === CalendarViews.Week && !isAllDayEvent;
  const prevDaySlotEnd = subDays(slotEnd, 1);
  const start = event.start > slotStart ? event.start : slotStart;
  const end = event.end < prevDaySlotEnd ? event.end : prevDaySlotEnd;
  const datesArray = end > start ? eachDayOfInterval({ start, end }) : [start];

  return (
    <StyledFlexTopCenter sx={{ height: '100%' }}>
      {datesArray.map(() => (
        <StyledEventWrapper
          key={uniqueId()}
          isScheduledWeekEvent={isScheduledWeekEvent}
          bgColor={isScheduledWeekEvent ? scheduledBackground : backgroundColor}
          borderRadius={getBorderRadius(isScheduledWeekEvent, eventSpanAfter, eventSpanBefore)}
          borderWidth={`0 0 0 ${isScheduledWeekEvent ? variables.borderWidth.xl : 0}`}
          borderColor={isScheduledWeekEvent ? scheduledColor : 'transparent'}
          eventsNumber={datesArray.length}
        >
          <Event title={title} event={event} uiType={uiType} {...props} />
        </StyledEventWrapper>
      ))}
    </StyledFlexTopCenter>
  );
};
