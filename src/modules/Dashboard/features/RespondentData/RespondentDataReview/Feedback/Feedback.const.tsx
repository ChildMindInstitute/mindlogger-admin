import { Dispatch, SetStateAction } from 'react';

import { DatavizActivity } from 'api';
import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview';

import { FeedbackAssessment } from './FeedbackAssessment';
import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackReviewed } from './FeedbackReviewed';

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
      content: <FeedbackNotes activity={selectedActivity} />,
      'data-testid': `${dataTestid}-notes`,
    },
    ...(assessment?.length
      ? [
          {
            labelKey: 'assessment',
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
            content: <FeedbackReviewed />,
            'data-testid': `${dataTestid}-reviewed`,
          },
        ]
      : []),
  ];
};