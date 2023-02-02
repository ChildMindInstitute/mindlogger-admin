import { useState } from 'react';
import { Calendar as ReactCalendar, SlotInfo, dateFnsLocalizer, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

import i18n from 'i18n';
import { Svg } from 'components';

import { CreateActivityPopup } from '../CreateActivityPopup';
import { EditActivityPopup } from '../EditActivityPopup';
import { RemoveScheduledEventPopup } from '../RemoveScheduledEventPopup';
import { getCalendarComponents, eventPropGetter, mockedEvents } from './Calendar.const';
import { StyledCalendarWrapper, StyledAddBtn } from './Calendar.styles';
import { CalendarEvent } from './Calendar.types';
import { getEventsWithOffRange } from './Calendar.utils';

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
  const [activeView, setActiveView] = useState('month');
  const [date, setDate] = useState<Date>(new Date());
  const [createActivityPopupVisible, setCreateActivityPopupVisible] = useState(false);
  const [editActivityPopupVisible, setEditActivityPopupVisible] = useState(false);
  const [removeScheduledEventPopupVisible, setRemoveScheduledEventPopupVisible] = useState(false);

  const events = getEventsWithOffRange(mockedEvents, date);

  const { components, messages, views } = getCalendarComponents(
    activeView,
    setActiveView,
    date,
    setDate,
  );

  const onNavigate = (newDate: Date) => setDate(newDate);

  const handleAddClick = () => setCreateActivityPopupVisible(true);

  const onSelectSlot = (slotInfo: SlotInfo) => {
    console.log('on select slot', slotInfo);
    setCreateActivityPopupVisible(true);
  };

  const onSelectEvent = (event: CalendarEvent) => {
    console.log('on select event', event);
    setEditActivityPopupVisible(true);
  };

  return (
    <>
      <StyledCalendarWrapper>
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
          eventPropGetter={eventPropGetter}
          view={activeView as View}
          onView={setActiveView}
          messages={messages}
        />
        <StyledAddBtn onClick={handleAddClick}>
          <Svg id="add" />
        </StyledAddBtn>
      </StyledCalendarWrapper>
      {createActivityPopupVisible && (
        <CreateActivityPopup
          open={createActivityPopupVisible}
          onClose={() => setCreateActivityPopupVisible(false)}
        />
      )}
      {editActivityPopupVisible && (
        <EditActivityPopup
          open={editActivityPopupVisible}
          onClose={() => setEditActivityPopupVisible(false)}
          setRemoveEventPopupVisible={setRemoveScheduledEventPopupVisible}
        />
      )}
      {removeScheduledEventPopupVisible && (
        <RemoveScheduledEventPopup
          open={removeScheduledEventPopupVisible}
          onClose={() => setRemoveScheduledEventPopupVisible(false)}
          onSubmit={() => setRemoveScheduledEventPopupVisible(false)}
          activityName="Daily Journal"
        />
      )}
    </>
  );
};
