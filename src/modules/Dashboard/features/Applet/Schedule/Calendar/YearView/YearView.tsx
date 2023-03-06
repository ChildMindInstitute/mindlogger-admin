import { DateLocalizer, NavigateAction } from 'react-big-calendar';
import { startOf, add } from 'react-big-calendar/lib/utils/dates';

import { DateFormats } from 'consts';

import { CalendarViews } from '../Calendar.types';
import { MonthCalendar } from './MonthCalendar';
import { StyledYear } from './YearView.styles';
import { YearViewProps } from './YearView.types';

export const YearView = ({ date, localizer, events, onNavigate, components }: YearViewProps) => {
  const firstMonth = startOf(date, CalendarViews.Year);
  const { setDate, setActiveView } = components;

  return (
    <StyledYear>
      {new Array(12).fill(null).map((_, index) => (
        <MonthCalendar
          key={index}
          events={events}
          date={add(firstMonth, index, CalendarViews.Month)}
          localizer={localizer}
          onNavigate={onNavigate}
          setDate={setDate}
          setActiveView={setActiveView}
        />
      ))}
    </StyledYear>
  );
};

YearView.range = (date: Date) => [startOf(date, CalendarViews.Year)];

YearView.navigate = (date: Date, action: NavigateAction) => {
  switch (action) {
    case 'PREV':
      return add(date, -1, CalendarViews.Year);

    case 'NEXT':
      return add(date, 1, CalendarViews.Year);

    default:
      return date;
  }
};

YearView.title = (date: Date, { localizer }: { localizer: DateLocalizer }) =>
  localizer.format(date, DateFormats.Year);
