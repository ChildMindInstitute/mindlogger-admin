import { AutocompleteOption } from 'shared/components/FormComponents';
import { Identifier } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type GetIdentifiers = {
  filterByIdentifier?: boolean;
  filterIdentifiers?: AutocompleteOption[];
  identifiers: Identifier[];
};

export type GetIdentifiersReturn = {
  selectedIdentifiers: string[];
  recentAnswer: { startDate: Date | null; endDate: Date | null };
} | null;
