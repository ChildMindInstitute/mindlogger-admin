import { Dispatch, SetStateAction } from 'react';

import { ReviewActivity } from 'api';

import { Answer } from '../../RespondentDataReview.types';

export type ReviewMenuItemProps = {
  selectedDate: Date | null;
  activity: ReviewActivity;
  isSelected: boolean;
  selectedAnswer: Answer | null;
  setSelectedActivity: Dispatch<SetStateAction<ReviewActivity | null>>;
  onSelectAnswer: (answer: Answer | null) => void;
  'data-testid'?: string;
};
