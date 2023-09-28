import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';
import { DecryptedTimeAnswer } from 'shared/types';

export const getTimeResponseItem = (timeValue?: DecryptedTimeAnswer['value']) => {
  if (!timeValue) return;

  const date = new Date();

  const { hours, hour, minutes, minute } = timeValue;

  date.setHours(hours ?? hour!);
  date.setMinutes(minutes ?? minute!);

  return format(date, DateFormats.Time);
};
