import {
  FlowResponses,
  ActivityCompletion,
  ResponseOption,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { Version } from 'modules/Dashboard/api';

export type EntityResponsesProps = {
  isFlow: boolean;
  flowResponses: FlowResponses[];
  answers: ActivityCompletion[];
  responseOptions: ResponseOption | null;
  subscalesFrequency: number;
  versions: Version[];
  'data-testid': string;
};
