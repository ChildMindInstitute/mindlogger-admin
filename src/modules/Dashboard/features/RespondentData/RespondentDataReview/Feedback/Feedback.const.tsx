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
) => [
  {
    labelKey: 'notes',
    content: <FeedbackNotes activity={selectedActivity} />,
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
        },
        {
          labelKey: 'reviewed',
          content: <FeedbackReviewed />,
        },
      ]
    : []),
];

export const enum FeedbackTabs {
  Notes = 0,
  Assessment = 1,
  Reviewed = 2,
}
