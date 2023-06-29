import { Version } from 'api';
import { ActivityResponse } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.types';

export type ActivityCompletedProps = {
  answers: ActivityResponse[];
  versions: Version[];
};
