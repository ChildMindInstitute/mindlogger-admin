import { FeedbackNotes } from '../../FeedbackNotes';
import { FeedbackReviews } from '../../FeedbackReviews';
import { GetFeedbackTabs } from './getFeedbackTabs.types';

export const getFeedbackTabs = ({ selectedEntity, assessment }: GetFeedbackTabs) => {
  const dataTestid = 'respondents-summary-feedback-tab';

  return [
    {
      labelKey: 'notes',
      id: 'feedback-notes',
      content: <FeedbackNotes entity={selectedEntity} />,
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
