import {
  ActivityCompletion,
  FormattedResponses,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { Version } from 'modules/Dashboard/api';

export type ActivityResponsesProps = {
  answers: ActivityCompletion[];
  versions: Version[];
  subscalesFrequency: number;
  responseOptions: Record<string, FormattedResponses[]> | null;
};
