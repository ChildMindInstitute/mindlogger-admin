import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';
import { DecryptedTimeAnswer } from 'shared/types';

export const getTimeResponseItem = (answer?: DecryptedTimeAnswer) => {
  if (!answer) return;

  const date = new Date();

  const hours = answer?.value?.hours ?? answer?.hour;
  const minutes = answer?.value?.minutes ?? answer?.minute;

  date.setHours(hours!);
  date.setMinutes(minutes!);

  return format(date, DateFormats.Time);
};
