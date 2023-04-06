import { Activity } from 'shared/state';

import { Response } from '../RespondentDataReview.types';

export type ReviewProps = {
  response: Response | null;
  activity: Activity;
};
