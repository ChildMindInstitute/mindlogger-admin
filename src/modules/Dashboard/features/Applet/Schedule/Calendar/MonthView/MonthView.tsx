import { useEffect, useRef } from 'react';
import CalendarMonthView from 'react-big-calendar/lib/Month';

import { COEFFICIENT_SHOW_ONE_MORE_EVENT } from './MonthView.const';

export type MonthViewType = typeof CalendarMonthView;

export const MonthView = (props: MonthViewType) => {
  const monthRef = useRef<MonthViewType>();
  const { date, activeView } = props.components;
  const { events } = props;

  useEffect(() => {
    (async () => {
      const containerElement = monthRef.current?.containerRef.current;
      const dayCellCollection = await containerElement.getElementsByClassName('rbc-day-bg');
      const dateCellCollection = await containerElement.getElementsByClassName('rbc-date-cell');
      const eventsElementsCollection = await containerElement.getElementsByClassName('rbc-row-segment');
      const dayCellHeight = dayCellCollection[0]?.offsetHeight;
      const dateCellHeight = dateCellCollection[0]?.offsetHeight;
      const eventElement = await eventsElementsCollection[0];

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
    })();
  }, [events, date, activeView]);

  return <CalendarMonthView {...props} ref={monthRef} />;
};

MonthView.range = CalendarMonthView.range;
MonthView.navigate = CalendarMonthView.navigate;
MonthView.title = CalendarMonthView.title;
