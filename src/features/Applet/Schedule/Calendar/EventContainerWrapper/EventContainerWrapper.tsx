import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

import { CalendarViews } from '../Calendar.types';
import { EventContainerWrapperProps, EventsStartEndDates } from './EventContainerWrapper.types';
import {
  getVariables,
  getEventClassNames,
  getOverlappingEvents,
} from './EventContainerWrapper.utils';

export const EventContainerWrapper = ({
  children,
  events,
  components,
}: EventContainerWrapperProps) => {
  const wrapperRef = useRef<HTMLElement>();
  const activeView = components?.activeView;
  const isWeekView = activeView === CalendarViews.Week;

  useEffect(() => {
    const {
      VISIBLE_EVENTS_QUANTITY,
      ALL_COL_QUANTITY,
      INDEX_SHOW_MORE_BTN,
      LEFT_OFFSET_COEFFICIENT,
      LEFT_OFFSET_START_VAL,
      VALUE_DECREASING_FULL_CONTAINER_WIDTH,
    } = getVariables(isWeekView);

    //TODO: Try to find a better solution for the hide/show many events, and responsive breakpoints logic in the day/week view
    setTimeout(() => {
      const eventsWrapper = wrapperRef.current;
      const containerEvents: NodeListOf<HTMLElement> | undefined =
        eventsWrapper?.querySelectorAll('.event-wrapper');
      const arrayOfEventsDates: EventsStartEndDates = [];

      if (eventsWrapper && containerEvents) {
        containerEvents.forEach((eventWrapper) => {
          const { id, start, end } = eventWrapper.dataset;
          const event = eventWrapper.querySelector('.rbc-event') as HTMLElement;
          const eventContent = eventWrapper.querySelector('.rbc-event-content') as HTMLElement;
          const width = event.offsetWidth;
          const height = event.offsetHeight;
          id && start && end && arrayOfEventsDates.push({ id, start, end });
          width && height && eventWrapper.classList.add(...getEventClassNames(width, height));
          eventWrapper.style.display = 'block';
          eventContent.style.opacity = '1';
        });

        const overlappingEvents = getOverlappingEvents(arrayOfEventsDates);

        overlappingEvents.forEach(({ eventIds }) => {
          const lengthToShow = eventIds.length - VISIBLE_EVENTS_QUANTITY;
          const eventsToHide = eventIds.slice(VISIBLE_EVENTS_QUANTITY);

          lengthToShow > 0 &&
            eventIds.slice(0, VISIBLE_EVENTS_QUANTITY).forEach((id, index) => {
              const currEventWrapper = eventsWrapper.querySelector(
                `[data-id='${id}']`,
              ) as HTMLElement;
              const currEventEl = currEventWrapper?.querySelector('.rbc-event') as HTMLElement;
              const showMoreEl = currEventWrapper.querySelector('.more');

              if (currEventEl) {
                currEventWrapper.classList.add('not-hidden-event');
                currEventEl.style.width = `calc((100% - ${VALUE_DECREASING_FULL_CONTAINER_WIDTH}) /${ALL_COL_QUANTITY})`;
                currEventEl.style.left = `${
                  LEFT_OFFSET_START_VAL + index * LEFT_OFFSET_COEFFICIENT
                }%`;

                if (index === INDEX_SHOW_MORE_BTN && !showMoreEl) {
                  currEventEl.insertAdjacentHTML(
                    'afterbegin',
                    `<span class="more">${lengthToShow}+</span>`,
                  );
                }
              }
            });

          lengthToShow > 0 &&
            eventsToHide.forEach((id) => {
              const currEventWrapper = eventsWrapper.querySelector(
                `[data-id='${id}']`,
              ) as HTMLElement;
              currEventWrapper?.classList.add('hidden-event');
            });
        });
      }
    });
  }, [events, isWeekView]);

  return <Box ref={wrapperRef}>{children}</Box>;
};
