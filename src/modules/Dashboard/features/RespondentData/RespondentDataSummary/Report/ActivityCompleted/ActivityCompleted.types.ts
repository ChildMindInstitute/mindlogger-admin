import { Version } from 'api';
import { ActivityCompletion } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.types';

export type ActivityCompletedProps = {
  answers: ActivityCompletion[];
  versions: Version[];
};
