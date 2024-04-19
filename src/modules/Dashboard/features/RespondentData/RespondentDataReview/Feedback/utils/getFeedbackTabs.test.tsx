import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { FeedbackNotes } from '../FeedbackNotes';
import { FeedbackReviews } from '../FeedbackReviews';
import { getFeedbackTabs } from './getFeedbackTabs';

describe('getFeedbackTabs', () => {
  const dataTestid = 'respondents-summary-feedback-tab';
  const selectedActivity = { id: '1', name: 'activity 1' };
  const notesTab = {
    labelKey: 'notes',
    id: 'feedback-notes',
    content: <FeedbackNotes activity={selectedActivity} />,
    'data-testid': `${dataTestid}-notes`,
  };

  test('returns correct tabs when assessment is defined', () => {
    const assessment = [
      { name: 'Assessment 1' },
      { name: 'Assessment 2' },
    ] as unknown as AssessmentActivityItem[];

    const tabs = getFeedbackTabs(selectedActivity, assessment);

    expect(tabs.length).toBe(2);
    expect(tabs).toEqual([
      notesTab,
      {
        labelKey: 'reviews',
        id: 'feedback-reviews',
        content: <FeedbackReviews />,
        'data-testid': `${dataTestid}-reviews`,
      },
    ]);
  });

  test('returns correct tabs when assessment is undefined', () => {
    const tabs = getFeedbackTabs(selectedActivity, undefined);

    expect(tabs.length).toBe(1);
    expect(tabs).toEqual([notesTab]);
  });
});
