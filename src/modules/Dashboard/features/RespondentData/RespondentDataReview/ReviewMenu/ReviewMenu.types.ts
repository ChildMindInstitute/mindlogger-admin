import { Dispatch, SetStateAction } from 'react';

import { Activity } from 'redux/modules';

import { ReviewType } from '../RespondentDataReview.types';

export type ReviewMenuProps = {
  activities: Activity[];
  selectedActivity: Activity;
  setSelectedActivity: Dispatch<SetStateAction<Activity>>;
  setSelectedReview: Dispatch<SetStateAction<ReviewType | null>>;
};
