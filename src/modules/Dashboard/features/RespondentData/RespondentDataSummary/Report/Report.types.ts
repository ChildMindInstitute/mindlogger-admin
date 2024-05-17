import { ActivityCompletion, FlowSubmission, ReviewCount } from '../../RespondentData.types';

export type CurrentActivityCompletionData = { answerId: string; date?: number } | null;

export type ReportContextType = {
  currentActivityCompletionData: CurrentActivityCompletionData;
  setCurrentActivityCompletionData: (value: CurrentActivityCompletionData) => void;
};

export type Completion = {
  id: string;
  endDatetime: string;
  areSubscalesVisible: boolean;
  reviewCount?: ReviewCount;
  isFlow: boolean;
};

export type GetCompletions = {
  isFlow: boolean;
  flowSubmissions: FlowSubmission[];
  answers: ActivityCompletion[];
};
