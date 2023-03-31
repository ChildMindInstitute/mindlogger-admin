import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackReviewed } from './FeedbackReviewed';

export const tabs = [
  {
    labelKey: 'notes',
    content: <FeedbackNotes />,
  },
  {
    labelKey: 'assessment',
    content: <>assessment</>,
  },
  {
    labelKey: 'reviewed',
    content: <FeedbackReviewed />,
  },
];
