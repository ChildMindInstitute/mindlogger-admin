import { FeedbackAssessment } from './FeedbackAssessment';
import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackReviewed } from './FeedbackReviewed';

export const tabs = [
  {
    labelKey: 'notes',
    content: <FeedbackNotes />,
  },
  {
    labelKey: 'assessment',
    content: <FeedbackAssessment />,
  },
  {
    labelKey: 'reviewed',
    content: <FeedbackReviewed />,
  },
];
