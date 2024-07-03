import { ReviewCount } from 'modules/Dashboard/api';

import { ActivityCompletion, FlowSubmission } from '../../RespondentData.types';

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
