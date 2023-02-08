import { useEffect, useRef } from 'react';
import CalendarMonthView from 'react-big-calendar/lib/Month';

import { COEFFICIENT_SHOW_ONE_MORE_EVENT } from './MonthView.const';

export type MonthViewType = typeof CalendarMonthView;

export const MonthView = (props: MonthViewType) => {
  const monthRef = useRef<MonthViewType>();
  const { date, activeView } = props.components;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const containerElement = monthRef.current?.containerRef.current;
      const dayCellHeight = containerElement.getElementsByClassName('rbc-day-bg')[0]?.offsetHeight;
      const dateCellHeight =
        containerElement.getElementsByClassName('rbc-date-cell')[0]?.offsetHeight;
      const eventElement = containerElement.getElementsByClassName('rbc-row-segment')[0];

      if (eventElement) {
        const eventHeight = eventElement.offsetHeight;
        const eventsToShowCoefficient = (dayCellHeight - dateCellHeight) / eventHeight;
        const decimalInCoefficient = eventsToShowCoefficient - Math.floor(eventsToShowCoefficient);
        const rowLimit =
          decimalInCoefficient > COEFFICIENT_SHOW_ONE_MORE_EVENT
            ? Math.round(eventsToShowCoefficient)
            : Math.floor(eventsToShowCoefficient);

        monthRef.current?.setState({ rowLimit });
      }
    });

    return () => clearTimeout(timeout);
  }, [date, activeView]);

  return <CalendarMonthView {...props} ref={monthRef} />;
};

MonthView.range = CalendarMonthView.range;
MonthView.navigate = CalendarMonthView.navigate;
MonthView.title = CalendarMonthView.title;
