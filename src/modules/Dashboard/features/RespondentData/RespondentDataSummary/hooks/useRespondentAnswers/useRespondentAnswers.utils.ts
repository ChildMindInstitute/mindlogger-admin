import { getOneWeekDateRange } from '../../utils/getOneWeekDateRange';
import {
  DateOrNullOrUndefined,
  GetIdentifiers,
  GetIdentifiersReturn,
  ProcessIdentifiersChange,
} from './useRespondentAnswers.types';

export const getDateISO = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hours, minutes] = time.split(':');

  const utcDate = Date.UTC(year, month, day, +hours, +minutes);

  return new Date(utcDate).toISOString().split('.')[0];
};

export const getIdentifiers = ({
  filterByIdentifier,
  filterIdentifiers = [],
  identifiers = [],
}: GetIdentifiers): GetIdentifiersReturn => {
  if (!filterByIdentifier) return null;

  const filterIds = new Set(filterIdentifiers.map((identifier) => identifier.id));

  const { selectedIdentifiers, answerDates } = identifiers.reduce(
    (
      acc: { selectedIdentifiers: string[]; answerDates: string[] },
      { encryptedValue, decryptedValue, lastAnswerDate },
    ) => {
      if (filterIds.has(decryptedValue)) {
        acc.selectedIdentifiers.push(encryptedValue);
        acc.answerDates.push(lastAnswerDate);
      }

      return acc;
    },
    { selectedIdentifiers: [], answerDates: [] },
  );

  const recentAnswerDateString = answerDates.reduce(
    (latest, current) => (latest > current ? latest : current),
    '',
  );

  return {
    selectedIdentifiers,
    recentAnswerDateString,
  };
};

export const processIdentifiersChange = ({
  isIdentifiersChange,
  adjustStartEndDates,
  setValue,
  lastAnswerDate,
  recentIdentifiersAnswerDate,
}: ProcessIdentifiersChange) => {
  if (!isIdentifiersChange) return null;

  let identifierAnswerStartDate: DateOrNullOrUndefined;
  let identifierAnswerEndDate: DateOrNullOrUndefined;
  let answerStartDate: DateOrNullOrUndefined;
  let answerEndDate: DateOrNullOrUndefined;

  if (adjustStartEndDates) {
    const { startDate, endDate } = getOneWeekDateRange(recentIdentifiersAnswerDate);
    if (startDate) {
      setValue('startDate', startDate);
      identifierAnswerStartDate = startDate;
    }

    if (endDate) {
      setValue('endDate', endDate);
      identifierAnswerEndDate = endDate;
    }
  } else {
    const { startDate: rangeStartDate, endDate: rangeEndDate } =
      getOneWeekDateRange(lastAnswerDate);

    if (rangeStartDate) {
      setValue('startDate', rangeStartDate);
      answerStartDate = rangeStartDate;
    }
    if (rangeEndDate) {
      setValue('endDate', rangeEndDate);
      answerEndDate = rangeEndDate;
    }
  }

  return {
    identifierAnswerStartDate,
    identifierAnswerEndDate,
    answerStartDate,
    answerEndDate,
  };
};
