import { ItemResponseType } from 'shared/consts';

import { AssessmentActivityItem } from '../../RespondentDataReview.types';

export const getDefaultValue = (responseType: ItemResponseType): string | number[] | null => {
  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.Slider:
      return null;
    case ItemResponseType.MultipleSelection:
      return [];
    default:
      return '';
  }
};

export const getDefaultFormValues = (assessment: AssessmentActivityItem[] = []) => ({
  newNote: '',
  assessmentItems:
    assessment.map(({ activityItem, answer }) => ({
      edited: answer?.edited || null,
      itemId: activityItem.id ?? '',
      answers: answer?.value ?? getDefaultValue(activityItem.responseType),
    })) ?? [],
});
