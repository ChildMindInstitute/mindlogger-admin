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
import { Svg } from 'shared/components';
import { CalendarEvent, calendarEvents } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { locales } from 'shared/consts';

import { CreateEventPopup } from '../CreateEventPopup';
import { EditEventPopup } from '../EditEventPopup';
import {
  eventPropGetter,
  getCalendarComponents,
  getDefaultStartDate,
  getHasWrapperMoreBtn,
} from './Calendar.utils';
import { StyledAddBtn, StyledCalendarWrapper } from './Calendar.styles';
import { AllDayEventsVisible, CalendarViews, OnViewFunc } from './Calendar.types';

const dateFnsLocalize = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export const Calendar = () => {
  const dispatch = useAppDispatch();
  const [activeView, setActiveView] = useState<CalendarViews>(CalendarViews.Month);
  const [date, setDate] = useState<Date>(new Date());
  const [currentYear, setCurrentYear] = useState(getYear(new Date()));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [createEventPopupVisible, setCreateEventPopupVisible] = useState(false);
  const [editEventPopupVisible, setEditEventPopupVisible] = useState(false);
  const [isAllDayEventsVisible, setIsAllDayEventsVisible] = useState<AllDayEventsVisible>(null);
  const [defaultStartDate, setDefaultStartDate] = useState(new Date());
  const [editedEvent, setEditedEvent] = useState<CalendarEvent | null>(null);

  const { eventsToShow = null, allDayEventsSortedByDays = null } =
    calendarEvents.useVisibleEventsData() || {};

  const { components, messages, views, formats } = getCalendarComponents(
    activeView,
    setActiveView,
    date,
    setDate,
    events,
    setEvents,
    isAllDayEventsVisible,
    setIsAllDayEventsVisible,
  );

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
      getHasWrapperMoreBtn(
        activeView,
        events,
        date,
        isAllDayEventsVisible,
        allDayEventsSortedByDays,
      )
    );
  }, [activeView, events, date, isAllDayEventsVisible, allDayEventsSortedByDays]);

  useEffect(() => {
    if (eventsToShow) {
      if (activeView === CalendarViews.Month) {
        const eventsWithOffRange = eventsToShow.map((event) => ({
          ...event,
          isOffRange: event.start.getMonth() !== date.getMonth(),
        }));
        setEvents(eventsWithOffRange);
      } else {
        setEvents(eventsToShow);
      }
    }
    setIsAllDayEventsVisible(null);
  }, [date, activeView, eventsToShow]);

  useEffect(() => {
    const chosenYear = getYear(date);
    if (chosenYear !== currentYear) {
      const { createNextYearEvents } = calendarEvents.actions;
      setCurrentYear(chosenYear);
      dispatch(createNextYearEvents({ yearToCreateEvents: chosenYear }));
    }
  }, [date]);

  return (
    <>
      <StyledCalendarWrapper hasMoreBtn={hasWrapperMoreBtn} className={activeView}>
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
        <StyledAddBtn onClick={handleAddClick}>
          <Svg id="add" />
        </StyledAddBtn>
      </StyledCalendarWrapper>
      {createEventPopupVisible && (
        <CreateEventPopup
          open={createEventPopupVisible}
          setCreateEventPopupVisible={setCreateEventPopupVisible}
          defaultStartDate={defaultStartDate}
        />
      )}
      {editedEvent && (
        <EditEventPopup
          open={editEventPopupVisible}
          editedEvent={editedEvent}
          setEditEventPopupVisible={setEditEventPopupVisible}
          defaultStartDate={defaultStartDate}
        />
      )}
    </>
  );
};
