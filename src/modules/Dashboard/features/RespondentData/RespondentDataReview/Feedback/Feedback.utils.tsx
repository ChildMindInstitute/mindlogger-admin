import { Dispatch, SetStateAction } from 'react';

import { ItemResponseType } from 'shared/consts';
import { DatavizActivity } from 'api';

import { AssessmentActivityItem } from '../RespondentDataReview.types';
import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackAssessment } from './FeedbackAssessment';
import { FeedbackReviewed } from './FeedbackReviewed';

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
  setActiveTab: Dispatch<SetStateAction<number>>,
  assessment: AssessmentActivityItem[] | undefined,
  assessmentStep: number,
  setAssessmentStep: Dispatch<SetStateAction<number>>,
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
            labelKey: 'assessment',
            id: 'feedback-assessment',
            content: (
              <FeedbackAssessment
                setActiveTab={setActiveTab}
                assessmentStep={assessmentStep}
                setAssessmentStep={setAssessmentStep}
              />
            ),
            'data-testid': `${dataTestid}-assessment`,
          },
          {
            labelKey: 'reviewed',
            id: 'feedback-reviewed',
            content: <FeedbackReviewed />,
            'data-testid': `${dataTestid}-reviewed`,
          },
        ]
      : []),
  ];
};
