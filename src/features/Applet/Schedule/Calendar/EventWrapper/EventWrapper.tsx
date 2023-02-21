import { cloneElement, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

import { EventWrapperProps } from './EventWrapper.types';

export const EventWrapper = ({ event, children, components }: EventWrapperProps) => {
  const emptyRef = useRef<HTMLElement>(null);
  const childrenRef = useRef<HTMLElement>(null);
  const isVisible = components.isAllDayEventsVisible?.visible;

  useEffect(() => {
    const parentElement =
      emptyRef.current?.parentElement?.parentElement ||
      childrenRef.current?.parentElement?.parentElement;

    if (parentElement) {
      for (let i = 0; i < parentElement.children.length; i++) {
        const child = parentElement.children[i];
        if (child.classList.contains('rbc-row-segment')) {
          isVisible || child.querySelector('.rbc-event')
            ? child.classList.remove('hidden')
            : child.classList.add('hidden');
        }
      }
    }
  }, [isVisible]);

  return event.isHiddenInTimeView ? (
    <Box ref={emptyRef} />
  ) : (
    <Box
      className="event-wrapper"
      ref={childrenRef}
      data-id={event.id}
      data-start={event.start}
      data-end={event.end}
    >
      {cloneElement(children, { ...children.props, title: event.title })}
    </Box>
  );
};
