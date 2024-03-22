import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';
import { DecryptedDateAnswer, DecryptedDateRangeAnswer } from 'shared/types';
import { createArray, getNormalizeTimezoneData } from 'shared/utils';

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

export const getDateForamttedResponse = (answer: DecryptedDateAnswer) => {
  if (!answer?.value) return '';

  const { day, month, year } = answer.value;
  const monthIndex = month - 1;
  const answerValue = new Date(year, monthIndex, day).toDateString();
  const formattedResponse = format(
    new Date(getNormalizeTimezoneData(answerValue).dateTime),
    DateFormats.DayMonthYear,
  );

  return formattedResponse;
};

export const getTimeRangeReponse = (answer?: DecryptedDateRangeAnswer) => {
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
