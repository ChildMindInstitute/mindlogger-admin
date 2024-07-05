import { format } from 'date-fns';

import { DecryptedDateAnswer, DecryptedDateRangeAnswer } from 'shared/types';
import { createArray, getNormalizeTimezoneData } from 'shared/utils';
import { DateFormats } from 'shared/consts';

import { ConcatenatedEntitiesReturn, GetConcatenatedEntities } from './RespondentData.types';

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

export const getEntityWithLatestAnswer = <T extends { lastAnswerDate: string | null }>(
  entities: T[],
): T | null =>
  entities?.reduce((prev: null | T, current) => {
    if (!current.lastAnswerDate) {
      return prev;
    }

    if (!prev || (prev?.lastAnswerDate && prev.lastAnswerDate <= current.lastAnswerDate)) {
      return current;
    }

    return prev;
  }, null);

export const getConcatenatedEntities = <T extends Record<string, unknown>>({
  activities,
  flows,
}: GetConcatenatedEntities<T>): ConcatenatedEntitiesReturn<T> => {
  const concatenatedEntities: ConcatenatedEntitiesReturn<T> = [];
  activities.forEach((activity) => {
    concatenatedEntities.push({ ...activity, isFlow: false });
  });
  flows.forEach((flow) => {
    concatenatedEntities.push({ ...flow, isFlow: true });
  });

  return concatenatedEntities;
};
