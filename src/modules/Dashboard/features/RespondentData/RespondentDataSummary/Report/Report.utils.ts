import { Version } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';

import {
  DEFAULT_END_DATE,
  DEFAULT_END_TIME,
  DEFAULT_START_DATE,
  DEFAULT_START_TIME,
} from './Report.const';
import { Identifier } from '../RespondentDataSummary.types';

export const getDefaultFilterValues = (versions: Version[]) => {
  const versionsFilter = versions.map(({ version }) => ({ id: version, label: version }));

  return {
    startDateEndDate: [DEFAULT_START_DATE, DEFAULT_END_DATE],
    moreFiltersVisisble: false,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    versions: versionsFilter,
  };
};

export const getDateTime = (date: Date, time: string) => {
  const [hours, mins] = time.split(':');

  return new Date(new Date((date || new Date()).setHours(+hours)).setMinutes(+mins));
};

export const getDateISO = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hours, mins] = time.split(':');

  const utcDate = Date.UTC(year, month, day, +hours, +mins);

  return new Date(utcDate).toISOString().split('.')[0];
};

export const getIdentifiers = (
  filterByIdentifier = false,
  filterIdentifiers = [] as AutocompleteOption[],
  identifiers = [] as Identifier[],
): string[] | undefined => {
  if (!filterByIdentifier) return;

  return identifiers.reduce(
    (decryptedIdentifiers: string[], { encryptedValue, decryptedValue }: Identifier) => {
      const identifier = filterIdentifiers.find(
        (filterIdentifier) => filterIdentifier.id === decryptedValue,
      );

      return identifier ? [...decryptedIdentifiers, encryptedValue] : decryptedIdentifiers;
    },
    [],
  );
};
