import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { ItemResponseType } from 'shared/consts';

import { Feedback } from './Feedback';
import { RespondentDataReviewContext } from '../RespondentDataReview.context';
import { AssessmentActivityItem, FeedbackTabs } from '../RespondentDataReview.types';

const mockActiveTab = FeedbackTabs.Notes;
const mockSetActiveTab = jest.fn();
const mockOnClose = jest.fn();
const activityItem = {
  question: {
    en: 'How was a response?',
  },
  responseType: ItemResponseType.SingleSelection,
  responseValues: {
    paletteName: null,
    options: [
      {
        id: '042006b9-72c1-487b-913b-06b1eb3756a7',
        text: 'Good',
        image: '',
        score: null,
        tooltip: null,
        isHidden: false,
        color: null,
        alert: null,
        value: 0,
      },
      {
        id: '8b737ab1-4137-4d81-9b11-a86323b2a7ed',
        text: 'Bad',
        image: '',
        score: null,
        tooltip: null,
        isHidden: false,
        color: null,
        alert: null,
        value: 1,
      },
    ],
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    randomizeOptions: false,
    timer: 0,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
    setPalette: false,
    addTokens: null,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    autoAdvance: false,
  },
  name: 'ItemSS',
  isHidden: false,
  allowEdit: true,
  id: 'd90f7eae-c265-4d96-87a6-a95735fe950e',
  order: 1,
};
const assessment = [
  {
    activityItem,
    answer: {
      value: '1',
      edited: 1712149184973,
    },
    items: [activityItem],
  },
] as unknown as AssessmentActivityItem[];

const selectedActivity = {
  id: '48bcf241-a596-4ada-940e-1e220205421f',
  name: 'Activity__3',
  answerDates: [
    {
      createdAt: '2024-03-14T14:28:05.537594',
      answerId: '74519a16-0869-462f-82a5-96beae11fd20',
      endDatetime: '2024-03-14T14:28:04.822000',
    },
    {
      createdAt: '2024-03-14T14:50:38.637755',
      answerId: 'fa9bbea4-7a08-4e27-9fb4-0cc4980e327d',
      endDatetime: '2024-03-14T14:50:38.637755',
    },
  ],
  lastAnswerDate: '2024-03-14T14:50:38.637755',
};

const renderComponent = (isFeedbackOpen = true) => {
  renderWithProviders(
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    <RespondentDataReviewContext.Provider value={{ assessment, isFeedbackOpen }}>
      <Feedback
        activeTab={mockActiveTab}
        setActiveTab={mockSetActiveTab}
        onClose={mockOnClose}
        selectedActivity={selectedActivity}
      />
    </RespondentDataReviewContext.Provider>,
  );
};

describe('Feedback component', () => {
  test('renders correctly when open', () => {
    renderComponent();

    expect(screen.getByTestId('respondents-review-feedback-menu')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
    expect(screen.getByTestId('respondents-summary-feedback-notes')).toBeInTheDocument();
  });

  test('does not show when closed', () => {
    renderComponent(false);

    expect(screen.queryByTestId('respondents-review-feedback-menu')).toHaveStyle({ width: 0 });
  });

  test('calls onClose when close button is clicked', async () => {
    renderComponent();

    await userEvent.click(screen.getByTestId('respondents-review-feedback-menu-close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
