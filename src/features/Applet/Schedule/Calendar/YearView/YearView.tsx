import { DateLocalizer } from 'react-big-calendar';

export const YearView = () => <div>Year View</div>;

YearView.title = (date: Date, { localizer }: { localizer: DateLocalizer }) =>
  localizer.format(date, 'yyy');
