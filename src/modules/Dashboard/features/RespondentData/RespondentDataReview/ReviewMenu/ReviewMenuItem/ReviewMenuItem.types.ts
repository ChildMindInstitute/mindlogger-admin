import { AnswerDate, ReviewActivity, ReviewFlow } from 'modules/Dashboard/api';

import { OnSelectActivityOrFlow, OnSelectAnswer } from '../../RespondentDataReview.types';

export type ReviewMenuItemProps = {
  item: ReviewActivity | ReviewFlow;
  isSelected: boolean;
  selectedAnswer: AnswerDate | null;
  onSelectItem: OnSelectActivityOrFlow;
  onSelectAnswer: OnSelectAnswer;
  'data-testid'?: string;
};
