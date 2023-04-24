import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as ReactCalendar,
  dateFnsLocalizer,
  Formats,
  SlotInfo,
  View,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, getDay, parse, startOfWeek, getYear } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

import i18n from 'i18n';
import { Svg } from 'shared/components';
import { CalendarEvent, calendarEvents } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';

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

const locales = {
  'en-US': enUS,
  fr,
};

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

  const eventsToShow = calendarEvents.useVisibleEventsData() || [];

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

  const onSelectEvent = (event: CalendarEvent) => {
    setEditEventPopupVisible(true);
    setDefaultStartDate(getDefaultStartDate(event.start));
    setEditedEvent(event);
  };

  const hasWrapperMoreBtn = useMemo(
    () =>
      (activeView === CalendarViews.Week || activeView === CalendarViews.Day) &&
      getHasWrapperMoreBtn(activeView, events, date, isAllDayEventsVisible),
    [activeView, events, date, isAllDayEventsVisible],
  );

  useEffect(() => {
    setIsAllDayEventsVisible(null);
  }, [date, activeView]);

  useEffect(() => {
    const chosenYear = getYear(date);
    if (chosenYear !== currentYear) {
      setCurrentYear(chosenYear);
      dispatch(calendarEvents.actions.setNextYearEvents({ yearToCreateEvents: chosenYear }));
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
          events={eventsToShow}
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
