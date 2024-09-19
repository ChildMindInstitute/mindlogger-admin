import { LabeledSubscaleScore } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Subscales/Subscales.types';

export type ScoresProps = {
  reviewDate?: number;
  finalSubscaleScore?: number;
  frequency?: number;
  optionText?: string;
  subscaleScores: LabeledSubscaleScore[];
  showAllSubscaleResultsVisible: boolean;
};
