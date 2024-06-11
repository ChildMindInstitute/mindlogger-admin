import {
  ActivityCompletion,
  FormattedResponses,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { Version } from 'modules/Dashboard/api';

export type FlowResponsesProps = {
  activityId: string;
  activityName: string;
  isPerformanceTask: boolean;
  answers: ActivityCompletion[];
  versions: Version[];
  subscalesFrequency: number;
  responseOptions: Record<string, FormattedResponses[]> | null;
  flowResponsesIndex: number;
  'data-testid': string;
};
