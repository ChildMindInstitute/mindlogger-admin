import {
  AssessmentFormItem,
  FormattedAssessmentItem,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/FeedbackAssessmentForm/FeedbackAssessmentForm.types';
import { AnswerValue } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { ItemResponseType } from 'shared/consts';

export const getDefaultValue = (responseType: ItemResponseType): string | string[] | null => {
  switch (responseType) {
    case ItemResponseType.Slider:
      return null;
    case ItemResponseType.MultipleSelection:
      return [];
    default:
      return '';
  }
};

export const getAnswerValue = (answerValue: AnswerValue) => {
  if (typeof answerValue === 'object') {
    return answerValue?.value || '';
  }

  return answerValue;
};

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
        },
      ],
    }),
    {
      itemIds: [],
      answers: [],
    },
  );
