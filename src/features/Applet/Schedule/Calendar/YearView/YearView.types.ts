import { Dispatch, SetStateAction } from 'react';
import { CalendarProps } from 'react-big-calendar';

export type YearViewProps = CalendarProps & {
  components: CalendarProps['components'] & {
    setDate: Dispatch<SetStateAction<Date>>;
    setActiveView: Dispatch<SetStateAction<string>>;
  };
};
