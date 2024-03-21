import { format } from 'date-fns';

import { AutocompleteOption } from 'shared/components/FormComponents';
import { DateFormats } from 'shared/consts';
import { DecryptedDateAnswer } from 'shared/types';
import { createArray, getNormalizeTimezoneData } from 'shared/utils';

import { Identifier } from './RespondentData.types';

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

export const getUniqueIdentifierOptions = (identifiers: Identifier[]) =>
  identifiers.reduce((uniqueIdentifiers: AutocompleteOption[], identifierItem) => {
    if (!identifierItem) return uniqueIdentifiers;

    const { decryptedValue } = identifierItem;

    if (
      uniqueIdentifiers &&
      !uniqueIdentifiers.find((identifier) => identifier.id === decryptedValue)
    ) {
      return [
        ...uniqueIdentifiers,
        {
          label: decryptedValue,
          id: decryptedValue,
        },
      ];
    }

    return uniqueIdentifiers;
  }, []);

export const getDateFormattedResponse = (answer: DecryptedDateAnswer) => {
  if (!answer?.value) return '';

  const { day, month, year } = answer.value;
  const monthIndex = month - 1;
  const answerValue = new Date(year, monthIndex, day).toDateString();

  return format(new Date(getNormalizeTimezoneData(answerValue).dateTime), DateFormats.DayMonthYear);
};
