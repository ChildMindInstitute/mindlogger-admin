import { Dispatch, SetStateAction } from 'react';

import { Activity, Answer } from '../RespondentDataReview.types';

export type ReviewMenuProps = {
  selectedActivity: Activity | null;
  selectedAnswer: Answer | null;
  setSelectedActivity: Dispatch<SetStateAction<Activity | null>>;
  setSelectedAnswer: Dispatch<SetStateAction<Answer | null>>;
};
