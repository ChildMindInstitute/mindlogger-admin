import { AutocompleteOption } from 'shared/components/FormComponents';
import { ItemResponseType } from 'shared/consts';

import { ActivityOrFlow } from '../RespondentData.types';

export type FetchAnswers = {
  entity: ActivityOrFlow;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  filterByIdentifier?: boolean;
  identifier?: AutocompleteOption[];
  versions?: AutocompleteOption[];
  isIdentifiersChange?: boolean;
};

export type GetIdentifiersVersions = {
  entity: ActivityOrFlow;
};

export type GetSingleMultiSelectionPerRowAnswers = {
  responseType: ItemResponseType;
  currentAnswer: string | string[] | null;
  date: string;
};
