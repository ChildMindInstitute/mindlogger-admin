import { DatavizActivity } from 'modules/Dashboard/api';

import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { FeedbackNotes } from '../FeedbackNotes';
import { FeedbackReviews } from '../FeedbackReviews';

export const getFeedbackTabs = (
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
