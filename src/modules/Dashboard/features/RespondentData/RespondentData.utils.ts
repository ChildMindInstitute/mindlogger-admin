import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';
import { DecryptedDateAnswer } from 'shared/types';
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
  const day = answer.value.day;
  const month = answer.value.month - 1;
  const year = answer.value.year;
  const answerValue = new Date(year, month, day).toDateString();
  const formattedResponse = format(
    new Date(getNormalizeTimezoneData(answerValue).dateTime),
    DateFormats.DayMonthYear,
  );

  return formattedResponse;
};
