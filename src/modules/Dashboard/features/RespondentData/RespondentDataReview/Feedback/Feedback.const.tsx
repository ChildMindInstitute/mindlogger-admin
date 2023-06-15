import { Dispatch, SetStateAction } from 'react';

import { DatavizActivity } from 'api';

import { FeedbackAssessment } from './FeedbackAssessment';
import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackReviewed } from './FeedbackReviewed';

export const getTabs = (
  selectedActivity: DatavizActivity,
  setActiveTab: Dispatch<SetStateAction<number>>,
  isAssessmentVisible: boolean,
) => [
  {
    labelKey: 'notes',
    content: <FeedbackNotes activity={selectedActivity} />,
  },
  ...(isAssessmentVisible
    ? [
        {
          labelKey: 'assessment',
          content: <FeedbackAssessment setActiveTab={setActiveTab} />,
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
