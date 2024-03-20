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
