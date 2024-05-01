import { Dispatch, SetStateAction } from 'react';

import { ReviewActivity } from 'api';

import { Answer, SelectAnswerProps } from '../../RespondentDataReview.types';

export type ReviewMenuItemProps = {
  activity: ReviewActivity;
  isSelected: boolean;
  selectedAnswer: Answer | null;
  setSelectedActivity: Dispatch<SetStateAction<ReviewActivity | null>>;
  onSelectAnswer: (props: SelectAnswerProps) => void;
  'data-testid'?: string;
};
