import { Dispatch, SetStateAction } from 'react';

import { ReviewActivity } from 'api';

import { Answer } from '../../RespondentDataReview.types';

export type ReviewMenuItemProps = {
  selectedDate: Date;
  activity: ReviewActivity;
  isSelected: boolean;
  selectedAnswer: Answer | null;
  setSelectedActivity: Dispatch<SetStateAction<ReviewActivity | null>>;
  setSelectedAnswer: Dispatch<SetStateAction<Answer | null>>;
  'data-testid'?: string;
};
