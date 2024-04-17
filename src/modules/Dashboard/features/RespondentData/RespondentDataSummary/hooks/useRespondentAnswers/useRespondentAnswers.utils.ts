import {
  GetIdentifiers,
  GetIdentifiersReturn,
} from '../useDatavizSummaryRequests/useDatavizSummaryRequests.types';
import { getOneWeekDateRange } from '../../utils/getOneWeekDateRange';

export const getDateISO = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hours, minutes] = time.split(':');

  const utcDate = Date.UTC(year, month, day, +hours, +minutes);

  return new Date(utcDate).toISOString().split('.')[0];
};

export const getIdentifiers = ({
  filterByIdentifier = false,
  filterIdentifiers = [],
  identifiers = [],
}: GetIdentifiers): GetIdentifiersReturn => {
  if (!filterByIdentifier || !filterIdentifiers) return null;

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

  const recentDate = answerDates.reduce(
    (latest, current) => (latest > current ? latest : current),
    '',
  );

  const { startDate, endDate } = getOneWeekDateRange(recentDate);

  return {
    selectedIdentifiers,
    recentAnswer: {
      startDate,
      endDate,
    },
  };
};
