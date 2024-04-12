import { AutocompleteOption } from 'shared/components/FormComponents';
import { Identifier } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export const getUniqueIdentifierOptions = (identifiers: Identifier[]) => {
  const uniqueIdentifiersSet = new Set<string>();

  return identifiers.reduce((uniqueIdentifiers: AutocompleteOption[], identifierItem) => {
    if (!identifierItem) return uniqueIdentifiers;

    const { decryptedValue } = identifierItem;

    if (!uniqueIdentifiersSet.has(decryptedValue)) {
      uniqueIdentifiersSet.add(decryptedValue);

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
};
