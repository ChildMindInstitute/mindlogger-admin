import { ItemResponseType } from 'shared/consts';
import { AnswerDTO } from 'shared/types';

import { AssessmentFormItem, FormattedAssessmentItem } from './FeedbackAssessmentForm.types';

export const getDefaultValue = (responseType: ItemResponseType): string | number[] | null => {
  switch (responseType) {
    case ItemResponseType.Slider:
      return null;
    case ItemResponseType.MultipleSelection:
      return [];
    default:
      return '';
  }
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
        } as AnswerDTO,
      ],
    }),
    {
      itemIds: [],
      answers: [],
    },
  );
