import { AutocompleteOption } from 'shared/components/FormComponents';
import { Identifier } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export const getDateISO = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hours, minutes] = time.split(':');

  const utcDate = Date.UTC(year, month, day, +hours, +minutes);

  return new Date(utcDate).toISOString().split('.')[0];
};

export const getIdentifiers = (
  filterByIdentifier = false,
  filterIdentifiers = [] as AutocompleteOption[],
  identifiers = [] as Identifier[],
): string[] | undefined => {
  if (!filterByIdentifier) return;

  const filterIds = new Set(filterIdentifiers.map((identifier) => identifier.id));

  return identifiers.reduce(
    (decryptedIdentifiers: string[], { encryptedValue, decryptedValue }) => {
      if (filterIds.has(decryptedValue)) {
        decryptedIdentifiers.push(encryptedValue);
      }

      return decryptedIdentifiers;
    },
    [],
  );
};
