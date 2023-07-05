import {
  AdditionalInformation,
  SubscaleScore,
} from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Subscales/Subscales.types';

export type ScoresProps = {
  reviewDate?: number;
  finalSubscaleScore?: number;
  frequency?: number;
  additionalInformation?: AdditionalInformation;
  subscaleScores: SubscaleScore[];
};
