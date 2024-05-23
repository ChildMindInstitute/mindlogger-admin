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
  let hourFrom: number;
  let minuteFrom: number;
  let hourTo: number;
  let minuteTo: number;

  if (answer.value.from) {
    hourFrom = answer.value.from.hour;
    minuteFrom = answer.value.from.minute;
    dateFrom.setHours(hourFrom);
    dateFrom.setMinutes(minuteFrom);
  }
  if (answer.value.to) {
    hourTo = answer.value.to.hour;
    minuteTo = answer.value.to.minute;
    dateTo.setHours(hourTo);
    dateTo.setMinutes(minuteTo);
  }

  return {
    from: answer.value.from ? format(dateFrom, DateFormats.Time) : '',
    to: answer.value.to ? format(dateTo, DateFormats.Time) : '',
  };
};

export const getActivityWithLatestAnswer = <T extends { lastAnswerDate: string | null }>(
  activities: T[],
): T | null =>
  activities?.reduce((prev: null | T, current) => {
    if (!current.lastAnswerDate) {
      return prev;
    }

    if (!prev || (prev?.lastAnswerDate && prev.lastAnswerDate < current.lastAnswerDate)) {
      return current;
    }

    return prev;
  }, null);
