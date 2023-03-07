import { cloneElement, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { format } from 'date-fns';

import { Tooltip } from 'shared/components';
import { DateFormats } from 'consts';

import { EventWrapperProps, UiType } from './EventWrapper.types';
import { getEventEndTime } from '../Calendar.utils';

export const EventWrapper = ({
  event: { title, id, start, end, isHiddenInTimeView },
  children,
  components,
  uiType = UiType.TimeView,
}: EventWrapperProps) => {
  const emptyRef = useRef<HTMLElement>(null);
  const childrenRef = useRef<HTMLElement>(null);
  const isVisible = components?.isAllDayEventsVisible?.visible;
  const timeView = uiType === UiType.TimeView;

  const tooltipTitle = (
    <>
      <Box>{`${format(start, DateFormats.Time)}${getEventEndTime(end)}`}</Box>
      <Box>{title}</Box>
    </>
  );

  useEffect(() => {
    if (timeView) {
      const parentElement =
        emptyRef.current?.parentElement?.parentElement ||
        childrenRef.current?.parentElement?.parentElement;

      if (parentElement) {
        for (const child of Array.from(parentElement.children)) {
          if (child.classList.contains('rbc-row-segment')) {
            isVisible || child.querySelector('.rbc-event')
              ? child.classList.remove('hidden')
              : child.classList.add('hidden');
          }
        }
      }
    }
  }, [isVisible]);

  return timeView && isHiddenInTimeView ? (
    <Box ref={emptyRef} />
  ) : (
    <Box className="event-wrapper" ref={childrenRef} data-id={id} data-start={start} data-end={end}>
      <Tooltip followCursor tooltipTitle={tooltipTitle} placement="top">
        {cloneElement(children, { ...children.props, title: '' })}
      </Tooltip>
    </Box>
  );
};
