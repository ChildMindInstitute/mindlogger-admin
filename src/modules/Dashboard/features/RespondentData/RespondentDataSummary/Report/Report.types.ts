import { AutocompleteOption } from 'shared/components/FormComponents';
import { Version, ReviewCount } from 'modules/Dashboard/api';

import {
  ActivityCompletion,
  ActivityOrFlow,
  FlowResponses,
  FlowSubmission,
  FormattedResponses,
  Identifier,
} from '../../RespondentData.types';

export type CurrentActivityCompletionData = { answerId: string; date?: number } | null;

export type ReportContextType = {
  currentActivityCompletionData: CurrentActivityCompletionData;
  setCurrentActivityCompletionData: (value: CurrentActivityCompletionData) => void;
};

export type Completion = {
  id: string;
  endDatetime: string;
  areSubscalesVisible: boolean;
  isFlow: boolean;
  reviewCount?: ReviewCount;
};

export type GetCompletions = {
  isFlow: boolean;
  flowSubmissions: FlowSubmission[];
  answers: ActivityCompletion[];
};

export type ReportValues = [
  ActivityCompletion[],
  Record<string, FormattedResponses[]> | null,
  number,
  ActivityOrFlow,
  Identifier[],
  Version[],
  AutocompleteOption[],
  FlowSubmission[],
  FlowResponses[],
];
