import { useEffect, useRef } from 'react';

import { Box } from '@mui/material';

import { EVENT_CLASSNAME } from '../Calendar.const';
import { CalendarViews } from '../Calendar.types';
import {
  ALL_COL_QUANTITY_WEEK_VIEW,
  INDEX_SHOW_MORE_BTN_WEEK_VIEW,
  LEFT_OFFSET_COEFFICIENT_WEEK_VIEW,
  LEFT_START_VAL_WEEK_VIEW,
  MAX_EVENTS_DAY_VIEW,
  MAX_VISIBLE_EVENTS_WEEK_VIEW,
  MIN_EVENT_WIDTH_DAY_VIEW,
  OFFSET_BETWEEN_EVENTS,
  VALUE_DECREASING_CONTAINER_WIDTH_WEEK_VIEW,
} from './EventContainerWrapper.const';
import { EventContainerWrapperProps, EventsStartEndDates } from './EventContainerWrapper.types';
import { getEventClassNames, getOverlappingEvents } from './EventContainerWrapper.utils';

export const EventContainerWrapper = ({ children, events, components }: EventContainerWrapperProps) => {
  const wrapperRef = useRef<HTMLElement>();
  const activeView = components?.activeView;
  const isWeekView = activeView === CalendarViews.Week;

  useEffect(() => {
    const updateEventsLayout = async () => {
      const eventsWrapper = await wrapperRef.current;
      const containerEvents: NodeListOf<HTMLElement> | undefined =
        await eventsWrapper?.querySelectorAll('.event-wrapper');
      const timeContent = (await eventsWrapper?.closest('.rbc-day-slot')) as HTMLElement;

      if (!eventsWrapper || !containerEvents?.length) {
        if (!timeContent) return;
        timeContent.style.minWidth = '';

        return;
      }

      const arrayOfEventsDates: EventsStartEndDates = [];

      await containerEvents.forEach(eventWrapper => {
        const { id, start, end } = eventWrapper.dataset;

        if (id && start && end) {
          arrayOfEventsDates.push({ id, start, end });
        }
      });

      const overlappingEvents = getOverlappingEvents({
        eventsArr: arrayOfEventsDates,
        maxEventsQuantity: isWeekView ? MAX_VISIBLE_EVENTS_WEEK_VIEW : MAX_EVENTS_DAY_VIEW,
      });

      // hiding overlapping events in week/day views and adding hidden events quantity info
      if (overlappingEvents.length) {
        if (isWeekView) {
          overlappingEvents.forEach(({ eventIds }) => {
            const lengthToShow = eventIds.length - MAX_VISIBLE_EVENTS_WEEK_VIEW;
            const eventsToHide = eventIds.slice(MAX_VISIBLE_EVENTS_WEEK_VIEW);

            lengthToShow > 0 &&
              eventIds.slice(0, MAX_VISIBLE_EVENTS_WEEK_VIEW).forEach((id, index) => {
                const currEventWrapper = eventsWrapper.querySelector(`[data-id='${id}']`) as HTMLElement;
                const currEventEl = currEventWrapper?.querySelector(EVENT_CLASSNAME) as HTMLElement;
                const showMoreEl = currEventWrapper.querySelector('.more');

                if (currEventEl) {
                  currEventWrapper.classList.add('not-hidden-event');
                  currEventEl.style.width = `calc((100% - ${VALUE_DECREASING_CONTAINER_WIDTH_WEEK_VIEW}) /${ALL_COL_QUANTITY_WEEK_VIEW})`;
                  currEventEl.style.left = `${LEFT_START_VAL_WEEK_VIEW + index * LEFT_OFFSET_COEFFICIENT_WEEK_VIEW}%`;

                  if (index === INDEX_SHOW_MORE_BTN_WEEK_VIEW && !showMoreEl) {
                    currEventEl.insertAdjacentHTML('afterbegin', `<span class="more">${lengthToShow}+</span>`);
                  }
                }
              });

            lengthToShow > 0 &&
              eventsToHide.forEach(id => {
                const currEventWrapper = eventsWrapper.querySelector(`[data-id='${id}']`) as HTMLElement;
                currEventWrapper?.classList.add('hidden-event');
              });
          });
        } else {
          const largestArrayOfEventsIds = overlappingEvents.reduce((acc, curr) =>
            curr.eventIds.length > acc.eventIds.length ? curr : acc,
          );
          const largestArrayOfEventsIdsLength = largestArrayOfEventsIds.eventIds.length;

          if (largestArrayOfEventsIdsLength && timeContent) {
            timeContent.style.minWidth = `${
              largestArrayOfEventsIdsLength * MIN_EVENT_WIDTH_DAY_VIEW +
              largestArrayOfEventsIdsLength * OFFSET_BETWEEN_EVENTS
            }px`;
          }
        }
      } else if (timeContent) {
        timeContent.style.minWidth = '';
      }

      // adding class names for event wrapper to show/hide event info by its width and height
      containerEvents.forEach(eventWrapper => {
        const event = eventWrapper.querySelector(EVENT_CLASSNAME) as HTMLElement;
        if (!event) return;

        const { offsetWidth: width, offsetHeight: height } = event;
        eventWrapper.classList.add(...getEventClassNames(width, height));
      });
    };

    updateEventsLayout();
  }, [events, isWeekView]);

  return <Box ref={wrapperRef}>{children}</Box>;
};
