import {
  EventsWidthBreakpoints,
  EventInterval,
  EventsHeightBreakpoints,
  OverlappingEventsArgs,
} from './EventContainerWrapper.types';

export const getEventClassNames = (width: number, height: number) => {
  let widthClassName = 'w-xl';
  let heightClassName = 'h-lg';

  if (width <= EventsWidthBreakpoints.Lg) {
    widthClassName = 'w-lg';
  }
  if (width <= EventsWidthBreakpoints.Md) {
    widthClassName = 'w-md';
  }
  if (width <= EventsWidthBreakpoints.Sm) {
    widthClassName = 'w-sm';
  }
  if (height <= EventsHeightBreakpoints.Md) {
    heightClassName = 'h-md';
  }
  if (height <= EventsHeightBreakpoints.Sm) {
    heightClassName = 'h-sm';
  }

  return [widthClassName, heightClassName];
};

export const getOverlappingEvents = ({ eventsArr, maxEventsQuantity }: OverlappingEventsArgs): EventInterval[] => {
  const intervals: EventInterval[] = [];
  for (const currEvent of eventsArr) {
    const currEventStart = new Date(currEvent.start).getTime();
    const currEventEnd = new Date(currEvent.end).getTime();
    let overlappingInterval: EventInterval | undefined;

    for (const interval of intervals) {
      if (currEventStart <= interval.intervalEnd && currEventEnd >= interval.intervalStart) {
        overlappingInterval = interval;
        break;
      }
    }

    if (overlappingInterval) {
      overlappingInterval.intervalStart = Math.min(currEventStart, overlappingInterval.intervalStart);
      overlappingInterval.intervalEnd = Math.max(currEventEnd, overlappingInterval.intervalEnd);
      overlappingInterval.eventIds.push(currEvent.id);
    } else {
      intervals.push({
        intervalStart: currEventStart,
        intervalEnd: currEventEnd,
        eventIds: [currEvent.id],
      });
    }
  }

  return intervals.filter((interval) => interval.eventIds.length > maxEventsQuantity);
};
