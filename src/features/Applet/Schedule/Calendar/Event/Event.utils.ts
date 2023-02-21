import { format } from 'date-fns';

import { DateFormats } from 'consts';

export const getEventEndTime = (date: Date) =>
  ` - ${
    format(date, DateFormats.TimeSeconds) === '23:59:59' ? '24:00' : format(date, DateFormats.Time)
  }`;
