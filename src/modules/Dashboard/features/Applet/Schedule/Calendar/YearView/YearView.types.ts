import { Dispatch, SetStateAction } from 'react';

import { CalendarProps } from 'react-big-calendar';

import { CalendarViews } from '../Calendar.types';

export type YearViewProps = CalendarProps & {
  components: CalendarProps['components'] & {
    setDate: Dispatch<SetStateAction<Date>>;
    setActiveView: Dispatch<SetStateAction<CalendarViews>>;
  };
};
