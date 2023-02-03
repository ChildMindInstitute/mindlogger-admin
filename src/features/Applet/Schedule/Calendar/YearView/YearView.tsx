import { DateLocalizer, NavigateAction } from 'react-big-calendar';
import { startOf, add } from 'react-big-calendar/lib/utils/dates';

import { MonthCalendar } from './MonthCalendar';
import { StyledYear } from './YearView.styles';
import { YearViewProps } from './YearView.types';

export const YearView = ({ date, localizer, events, onNavigate, components }: YearViewProps) => {
  const firstMonth = startOf(date, 'year');
  const { setDate, setActiveView } = components;

  return (
    <StyledYear>
      {new Array(12).fill(null).map((_, index) => (
        <MonthCalendar
          key={index}
          events={events}
          date={add(firstMonth, index, 'month')}
          localizer={localizer}
          onNavigate={onNavigate}
          setDate={setDate}
          setActiveView={setActiveView}
        />
      ))}
    </StyledYear>
  );
};

YearView.range = (date: Date) => [startOf(date, 'year')];

YearView.navigate = (date: Date, action: NavigateAction) => {
  switch (action) {
    case 'PREV':
      return add(date, -1, 'year');

    case 'NEXT':
      return add(date, 1, 'year');

    default:
      return date;
  }
};

YearView.title = (date: Date, { localizer }: { localizer: DateLocalizer }) =>
  localizer.format(date, 'yyy');
