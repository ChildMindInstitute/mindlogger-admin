import { AnswerDTO } from 'shared/types';

import { AssessmentFormItem } from '../Feedback.types';
import { FormattedAssessmentItem } from './FeedbackAssessment.types';

export const checkAnswerValue = (value: string | number | string[]) => {
  if (Array.isArray(value)) return !value.length;

  return !value?.toString().length;
};

export const formatAssessment = (assessmentItems: AssessmentFormItem[]) =>
  assessmentItems.reduce(
    (assessmentItem: FormattedAssessmentItem, item) => ({
      itemIds: [...assessmentItem.itemIds, item.itemId],
      answers: [
        ...assessmentItem.answers,
        {
          value: item.answers,
          text: null,
        } as AnswerDTO,
      ],
    }),
    {
      itemIds: [],
      answers: [],
    },
  );
