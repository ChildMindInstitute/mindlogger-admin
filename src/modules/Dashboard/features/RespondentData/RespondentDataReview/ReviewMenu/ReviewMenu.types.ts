import { Dispatch, SetStateAction } from 'react';

import { Activity } from 'redux/modules';

import { Response } from '../RespondentDataReview.types';

export type ReviewMenuProps = {
  activities: Activity[];
  selectedActivity: Activity;
  selectedResponse: Response | null;
  setSelectedActivity: Dispatch<SetStateAction<Activity>>;
  setSelectedResponse: Dispatch<SetStateAction<Response | null>>;
};
