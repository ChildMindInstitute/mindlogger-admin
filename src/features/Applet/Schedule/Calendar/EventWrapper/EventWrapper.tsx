import { EventWrapperProps } from './EventWrapper.types';

export const EventWrapper = ({ event, children }: EventWrapperProps) =>
  event.isHiddenInTimeView ? '' : children;
