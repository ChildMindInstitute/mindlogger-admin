import { cloneElement, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { format } from 'date-fns';

import { Tooltip } from 'shared/components/Tooltip';
import { DateFormats } from 'shared/consts';

import { EventWrapperProps, UiType } from './EventWrapper.types';

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
      <Box>{`${format(start, DateFormats.Time)} - ${format(end, DateFormats.Time)}`}</Box>
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
    <Box
      className="event-wrapper"
      ref={childrenRef}
      data-id={id}
      data-start={start}
      data-end={end}
      data-testid={`dashboard-calendar-${id}`}
    >
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
