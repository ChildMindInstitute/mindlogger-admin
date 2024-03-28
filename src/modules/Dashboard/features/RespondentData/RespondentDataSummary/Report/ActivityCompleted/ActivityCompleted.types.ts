import { Version } from 'api';
import { ActivityCompletion } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ActivityCompletedProps = {
  answers: ActivityCompletion[];
  versions: Version[];
};
