import { createArray } from 'shared/utils';
import { AutocompleteOption } from 'shared/components/FormComponents';

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
