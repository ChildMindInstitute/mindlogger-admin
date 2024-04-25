import { AutocompleteOption } from 'shared/components/FormComponents';
import { Identifier } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export const getUniqueIdentifierOptions = (identifiers: Identifier[]) => {
  const uniqueIdentifiersSet = new Set<string>();
  const uniqueIdentifiers: AutocompleteOption[] = [];

  identifiers.forEach((identifierItem) => {
    if (!identifierItem) return;

    const { decryptedValue } = identifierItem;

    if (!uniqueIdentifiersSet.has(decryptedValue)) {
      uniqueIdentifiersSet.add(decryptedValue);
      uniqueIdentifiers.push({
        label: decryptedValue,
        id: decryptedValue,
      });
    }
  });

  return uniqueIdentifiers;
};
