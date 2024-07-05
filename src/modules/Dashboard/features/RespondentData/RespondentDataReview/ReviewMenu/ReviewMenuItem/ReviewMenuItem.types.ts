import { AnswerDate, ReviewEntity } from 'modules/Dashboard/api';

import { OnSelectActivityOrFlow, OnSelectAnswer } from '../../RespondentDataReview.types';

export type ReviewMenuItemProps = {
  item: ReviewEntity;
  isSelected: boolean;
  selectedAnswer: AnswerDate | null;
  onSelectItem: OnSelectActivityOrFlow;
  onSelectAnswer: OnSelectAnswer;
  'data-testid'?: string;
};
