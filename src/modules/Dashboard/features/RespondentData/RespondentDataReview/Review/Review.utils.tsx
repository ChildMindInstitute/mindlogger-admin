import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';
import { DecryptedTimeAnswer } from 'shared/types';

export const getTimeResponseItem = ({ value: { minutes, hours } }: DecryptedTimeAnswer) => {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return format(date, DateFormats.Time);
};
