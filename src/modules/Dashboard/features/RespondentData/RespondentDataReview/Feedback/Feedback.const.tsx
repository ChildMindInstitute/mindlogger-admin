import { Activity } from '../RespondentDataReview.types';
import { FeedbackAssessment } from './FeedbackAssessment';
import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackReviewed } from './FeedbackReviewed';

export const getTabs = (selectedActivity: Activity) => [
  {
    labelKey: 'notes',
    content: <FeedbackNotes activity={selectedActivity} />,
  },
  {
    labelKey: 'assessment',
    content: <FeedbackAssessment activity={selectedActivity} />,
  },
  {
    labelKey: 'reviewed',
    content: <FeedbackReviewed />,
  },
];
