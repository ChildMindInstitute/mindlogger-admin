import { cloneElement, useEffect, useRef } from 'react';

import { Box } from '@mui/material';
import { format } from 'date-fns';

import { Tooltip } from 'shared/components/Tooltip';
import { DateFormats } from 'shared/consts';

import { EVENT_CLASSNAME } from '../Calendar.const';
import { EventWrapperProps, UiType } from './EventWrapper.types';

export const EventWrapper = ({
  event: { title, id, start, end, isHiddenInTimeView, startTime, endTime },
  children,
  components,
  uiType = UiType.TimeView,
}: EventWrapperProps) => {
  const emptyRef = useRef<HTMLElement>(null);
  const childrenRef = useRef<HTMLElement>(null);
  const timeView = uiType === UiType.TimeView;
  const isVisible = components?.isAllDayEventsVisible?.visible;

  useEffect(() => {
    if (timeView) {
      const parentElement =
        emptyRef.current?.parentElement?.parentElement || childrenRef.current?.parentElement?.parentElement;

      if (parentElement) {
        for (const child of Array.from(parentElement.children)) {
          if (child.classList.contains('rbc-row-segment')) {
            isVisible || child.querySelector(EVENT_CLASSNAME)
              ? child.classList.remove('hidden')
              : child.classList.add('hidden');
          }
        }
      }
    }
  }, [isVisible]);

  if (timeView && isHiddenInTimeView) {
    return <Box ref={emptyRef} />;
  }

  const tooltipTitle = (
    <>
      <Box>{`${startTime ?? format(start, DateFormats.Time)} - ${endTime ?? format(end, DateFormats.Time)}`}</Box>
      <Box>{title}</Box>
    </>
  );

  return (
    <Box
      className="event-wrapper"
      ref={childrenRef}
      data-id={id}
      data-start={start}
      data-end={end}
      data-testid={`dashboard-calendar-${id}`}>
      <Tooltip followCursor tooltipTitle={tooltipTitle} placement="top">
        {cloneElement(children, {
          ...children.props,
          title: '',
          style: {
            ...children.props.style,
            marginTop: '2px',
            height: `calc(${children.props.style.height} - 1px)`,
            minWidth: '18px',
          },
        })}
      </Tooltip>
    </Box>
  );
};
