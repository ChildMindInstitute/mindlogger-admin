import { Dispatch, SetStateAction } from 'react';

import { ReviewActivity } from 'api';

import { Answer } from '../RespondentDataReview.types';

export type ReviewMenuProps = {
  selectedActivity: ReviewActivity | null;
  selectedAnswer: Answer | null;
  setSelectedActivity: Dispatch<SetStateAction<ReviewActivity | null>>;
  onSelectAnswer: (answer: Answer | null) => void;
};
