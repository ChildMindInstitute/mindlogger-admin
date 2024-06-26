import { UseFormSetValue } from 'react-hook-form';

import { AutocompleteOption } from 'shared/components/FormComponents';
import {
  Identifier,
  RespondentsDataFormValues,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type GetIdentifiers = {
  filterByIdentifier?: boolean;
  filterIdentifiers?: AutocompleteOption[];
  identifiers: Identifier[];
};

export type GetIdentifiersReturn = {
  selectedIdentifiers: string[];
  recentAnswerDateString: string;
} | null;

export type ProcessIdentifiersChange = {
  isIdentifiersChange?: boolean;
  adjustStartEndDates: boolean;
  setValue: UseFormSetValue<RespondentsDataFormValues>;
  lastAnswerDate: string | null;
  recentIdentifiersAnswerDate?: string;
};

export type DateOrNullOrUndefined = Date | null | undefined;
