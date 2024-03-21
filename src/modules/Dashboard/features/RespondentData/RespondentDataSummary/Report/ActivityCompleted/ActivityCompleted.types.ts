import { Version } from 'api';

import { ActivityCompletion } from '../../../RespondentData.types';

export type ActivityCompletedProps = {
  answers: ActivityCompletion[];
  versions: Version[];
};
