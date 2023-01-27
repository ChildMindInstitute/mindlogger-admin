import { useEffect, useRef } from 'react';
import CalendarMonthView from 'react-big-calendar/lib/Month';

export type MonthViewType = typeof CalendarMonthView;

export const MonthView = (props: MonthViewType) => {
  const monthRef = useRef<MonthViewType>();

  useEffect(() => {
    if (monthRef.current?.state?.rowLimit < 3 || monthRef.current?.state.needLimitMeasure) {
      monthRef.current.setState({ rowLimit: 3 });
    }
  });

  return <CalendarMonthView {...props} ref={monthRef} />;
};

MonthView.range = CalendarMonthView.range;
MonthView.navigate = CalendarMonthView.navigate;
MonthView.title = CalendarMonthView.title;
