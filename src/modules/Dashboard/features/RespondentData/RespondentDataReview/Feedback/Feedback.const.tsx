import { Dispatch, SetStateAction } from 'react';

import { Activity } from '../RespondentDataReview.types';
import { FeedbackAssessment } from './FeedbackAssessment';
import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackReviewed } from './FeedbackReviewed';

export const getTabs = (
  selectedActivity: Activity,
  setActiveTab: Dispatch<SetStateAction<number>>,
) => [
  {
    labelKey: 'notes',
    content: <FeedbackNotes activity={selectedActivity} />,
  },
  {
    labelKey: 'assessment',
    content: <FeedbackAssessment setActiveTab={setActiveTab} />,
  },
  {
    labelKey: 'reviewed',
    content: <FeedbackReviewed />,
  },
];

export const enum FeedbackTabs {
  Notes = 0,
  Assessment = 1,
  Reviewed = 2,
}
