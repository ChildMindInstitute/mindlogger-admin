import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as ReactCalendar,
  dateFnsLocalizer,
  Formats,
  SlotInfo,
  View,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, getDay, getYear, parse, startOfWeek } from 'date-fns';

import i18n from 'i18n';
import { Svg } from 'shared/components/Svg';
import { CalendarEvent, calendarEvents } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { locales } from 'shared/consts';

import { CreateEventPopup } from '../CreateEventPopup';
import { EditEventPopup } from '../EditEventPopup';
import { dataTestId } from './Calendar.const';
import {
  eventPropGetter,
  getCalendarComponents,
  getDefaultStartDate,
  getHasWrapperMoreBtn,
} from './Calendar.utils';
import { StyledAddBtn, StyledCalendarWrapper } from './Calendar.styles';
import { AllDayEventsVisible, CalendarProps, CalendarViews, OnViewFunc } from './Calendar.types';

const dateFnsLocalize = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export const Calendar = ({ userId }: CalendarProps) => {
  const dispatch = useAppDispatch();
  const [activeView, setActiveView] = useState<CalendarViews>(CalendarViews.Month);
  const [date, setDate] = useState<Date>(new Date());
  const currentYear = getYear(new Date());
  const [currentCalendarYear, setCurrentCalendarYear] = useState(currentYear);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [createEventPopupVisible, setCreateEventPopupVisible] = useState(false);
  const [editEventPopupVisible, setEditEventPopupVisible] = useState(false);
  const [isAllDayEventsVisible, setIsAllDayEventsVisible] = useState<AllDayEventsVisible>(null);
  const [defaultStartDate, setDefaultStartDate] = useState(new Date());
  const [editedEvent, setEditedEvent] = useState<CalendarEvent | null>(null);

  const { setCalendarCurrentYear } = calendarEvents.actions;
  const { eventsToShow = null, allDayEventsSortedByDays = null } =
    calendarEvents.useVisibleEventsData() || {};

  const { components, messages, views, formats } = getCalendarComponents({
    activeView,
    setActiveView,
    date,
    setDate,
    events,
    setEvents,
    isAllDayEventsVisible,
    setIsAllDayEventsVisible,
  });

  const onNavigate = (newDate: Date) => setDate(newDate);

  const handleAddClick = () => {
    setCreateEventPopupVisible(true);
    setDefaultStartDate(new Date());
  };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    setCreateEventPopupVisible(true);
    setDefaultStartDate(getDefaultStartDate(slotInfo.start));
  };

  const onSelectEvent = (calendarEvent: CalendarEvent) => {
    setEditEventPopupVisible(true);
    setDefaultStartDate(
      getDefaultStartDate(
        calendarEvent.alwaysAvailable ? calendarEvent.eventStart : calendarEvent.start,
      ),
    );
    setEditedEvent(calendarEvent);
  };

  const hasWrapperMoreBtn = useMemo(() => {
    if (!activeView || !events || !date || !allDayEventsSortedByDays) {
      return false;
    }

    return (
      (activeView === CalendarViews.Week || activeView === CalendarViews.Day) &&
      getHasWrapperMoreBtn({ activeView, date, isAllDayEventsVisible, allDayEventsSortedByDays })
    );
  }, [activeView, events, date, isAllDayEventsVisible, allDayEventsSortedByDays]);

  useEffect(() => {
    if (eventsToShow) {
      if (activeView === CalendarViews.Month) {
        const eventsWithOffRangeWithoutCrossDay = eventsToShow.reduce(
          (acc: CalendarEvent[], event) => {
            if (!event.eventSpanBefore) {
              acc.push({
                ...event,
                isOffRange: event.start.getMonth() !== date.getMonth(),
              });
            }

            return acc;
          },
          [],
        );

        setEvents(eventsWithOffRangeWithoutCrossDay);
      } else if (activeView === CalendarViews.Year) {
        const eventsWithoutCrossDay = eventsToShow.filter((event) => !event.eventSpanBefore);

        setEvents(eventsWithoutCrossDay);
      } else {
        setEvents(eventsToShow);
      }
    }
    setIsAllDayEventsVisible(null);
  }, [date, activeView, eventsToShow]);

  useEffect(() => {
    const chosenYear = getYear(date);
    if (chosenYear === currentCalendarYear) return;
    setCurrentCalendarYear(chosenYear);
  }, [date]);

  useEffect(() => {
    dispatch(setCalendarCurrentYear({ calendarCurrentYear: currentCalendarYear }));
  }, [currentCalendarYear]);

  useEffect(
    () => () => {
      dispatch(calendarEvents.actions.resetCalendarEvents());
    },
    [],
  );

  return (
    <>
      <StyledCalendarWrapper
        hasMoreBtn={hasWrapperMoreBtn}
        className={activeView}
        data-testid={dataTestId}
      >
        <ReactCalendar
          date={date}
          onNavigate={onNavigate}
          localizer={dateFnsLocalize}
          culture={i18n.language}
          events={events}
          startAccessor="start"
          endAccessor="end"
          components={components}
          views={views}
          selectable
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          eventPropGetter={(event) => eventPropGetter(event, activeView)}
          view={activeView as View}
          onView={setActiveView as OnViewFunc}
          messages={messages}
          scrollToTime={new Date(date.setHours(3, 56))}
          formats={formats as Formats}
          dayLayoutAlgorithm="no-overlap"
        />
        <StyledAddBtn onClick={handleAddClick} data-testid={`${dataTestId}-create-event`}>
          <Svg id="add" />
        </StyledAddBtn>
      </StyledCalendarWrapper>
      {createEventPopupVisible && (
        <CreateEventPopup
          open={createEventPopupVisible}
          setCreateEventPopupVisible={setCreateEventPopupVisible}
          defaultStartDate={defaultStartDate}
          data-testid={`${dataTestId}-create-event-popup`}
          userId={userId}
        />
      )}
      {editedEvent && (
        <EditEventPopup
          open={editEventPopupVisible}
          editedEvent={editedEvent}
          setEditEventPopupVisible={setEditEventPopupVisible}
          defaultStartDate={defaultStartDate}
          data-testid={`${dataTestId}-edit-event-popup`}
        />
      )}
    </>
  );
};
