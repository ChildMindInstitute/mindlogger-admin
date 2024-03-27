import { format } from 'date-fns';

import { DecryptedDateAnswer, DecryptedDateRangeAnswer } from 'shared/types';
import { createArray, getNormalizeTimezoneData } from 'shared/utils';
import { DateFormats } from 'shared/consts';

export const getDateFormattedResponse = (answer: DecryptedDateAnswer) => {
  if (!answer?.value) return '';

  const { day, month, year } = answer.value;
  const monthIndex = month - 1;
  const answerValue = new Date(year, monthIndex, day).toDateString();

  return format(new Date(getNormalizeTimezoneData(answerValue).dateTime), DateFormats.DayMonthYear);
};

export const createArrayForSlider = ({
  maxValue,
  minValue,
}: {
  maxValue: number;
  minValue: number;
}) =>
  createArray(maxValue - minValue + 1, (index) => ({
    value: minValue + index,
    label: minValue + index,
  }));

export const getTimeRangeResponse = (answer?: DecryptedDateRangeAnswer) => {
  if (!answer?.value)
    return {
      from: '',
      to: '',
    };

  const dateFrom = new Date();
  const dateTo = new Date();
  const {
    from: { hour: hourFrom, minute: minuteFrom },
    to: { hour: hourTo, minute: minuteTo },
  } = answer.value;

  dateFrom.setHours(hourFrom);
  dateFrom.setMinutes(minuteFrom);
  dateTo.setHours(hourTo);
  dateTo.setMinutes(minuteTo);

  return {
    from: format(dateFrom, DateFormats.Time),
    to: format(dateTo, DateFormats.Time),
  };
};
