import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as ReactCalendar,
  dateFnsLocalizer,
  Formats,
  SlotInfo,
  View,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

import i18n from 'i18n';
import { Svg } from 'shared/components';

import { CreateActivityPopup } from '../CreateActivityPopup';
import { EditActivityPopup } from '../EditActivityPopup';
import {
  eventPropGetter,
  getCalendarComponents,
  getProcessedEvents,
  getHasWrapperMoreBtn,
} from './Calendar.utils';
import { StyledAddBtn, StyledCalendarWrapper } from './Calendar.styles';
import { AllDayEventsVisible, CalendarEvent, CalendarViews, OnViewFunc } from './Calendar.types';

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
  const [activeView, setActiveView] = useState<CalendarViews>(CalendarViews.Month);
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [createActivityPopupVisible, setCreateActivityPopupVisible] = useState(false);
  const [editActivityPopupVisible, setEditActivityPopupVisible] = useState(false);
  const [isAllDayEventsVisible, setIsAllDayEventsVisible] = useState<AllDayEventsVisible>(null);
  const [editedActivityName, setEditedActivityName] = useState('');
  const [defaultStartDate, setDefaultStartDate] = useState(new Date());

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
    setCreateActivityPopupVisible(true);
    setDefaultStartDate(new Date());
  };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    setCreateActivityPopupVisible(true);
    setDefaultStartDate(slotInfo.start);
  };

  const onSelectEvent = (event: CalendarEvent) => {
    setEditActivityPopupVisible(true);
    setEditedActivityName(event.title);
  };

  useEffect(() => {
    setIsAllDayEventsVisible(null);
    setEvents(getProcessedEvents(date));
  }, [date, activeView]);

  const hasWrapperMoreBtn = useMemo(
    () =>
      (activeView === CalendarViews.Week || activeView === CalendarViews.Day) &&
      getHasWrapperMoreBtn(activeView, events, date, isAllDayEventsVisible),
    [activeView, events, date, isAllDayEventsVisible],
  );

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
          selectable={true}
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
      {createActivityPopupVisible && (
        <CreateActivityPopup
          open={createActivityPopupVisible}
          setCreateActivityPopupVisible={setCreateActivityPopupVisible}
          defaultStartDate={defaultStartDate}
        />
      )}
      <EditActivityPopup
        open={editActivityPopupVisible}
        activityName={editedActivityName}
        setEditActivityPopupVisible={setEditActivityPopupVisible}
      />
    </>
  );
};
