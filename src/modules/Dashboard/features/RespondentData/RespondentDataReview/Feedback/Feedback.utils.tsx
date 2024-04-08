import { ItemResponseType } from 'shared/consts';
import { DatavizActivity } from 'api';

import { AssessmentActivityItem } from '../RespondentDataReview.types';
import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackReviews } from './FeedbackReviews';

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

export const getTabs = (
  selectedActivity: DatavizActivity,
  assessment: AssessmentActivityItem[] | undefined,
) => {
  const dataTestid = 'respondents-summary-feedback-tab';

  return [
    {
      labelKey: 'notes',
      id: 'feedback-notes',
      content: <FeedbackNotes activity={selectedActivity} />,
      'data-testid': `${dataTestid}-notes`,
    },
    ...(assessment?.length
      ? [
          {
            labelKey: 'reviews',
            id: 'feedback-reviews',
            content: <FeedbackReviews />,
            'data-testid': `${dataTestid}-reviews`,
          },
        ]
      : []),
  ];
};
