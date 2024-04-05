import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { FeedbackReviewer } from './FeedbackReviewer';
import { FeedbackReviewerProps } from './FeedbackReviewer.types';

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  CollapsedMdText: jest.fn(() => (
    <div data-testid="mock-collapsed-md-text">Mocked CollapsedMdText</div>
  )),
}));
const mockedOnReviewAnswerRemove = jest.fn();
const mockedReviewer = {
  id: 'c1dbef7d-a790-42d9-ad09-e680eb76af7c',
  firstName: 'John',
  lastName: 'Doe',
};
const mockedCreatedAt = '2024-04-04T11:49:10.821854';

const mockedReview = [
  {
    activityItem: {
      question: {
        en: 'How was a response?',
      },
      responseType: 'singleSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: '042006b9-72c1-487b-913b-06b1eb3756a7',
            text: 'Good',
            value: 0,
          },
          {
            id: '8b737ab1-4137-4d81-9b11-a86323b2a7ed',
            text: 'Bad',
            value: 1,
          },
        ],
      },
      config: {},
      name: 'ItemSS',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'd90f7eae-c265-4d96-87a6-a95735fe950e',
      order: 1,
    },
    answer: {
      value: '0',
      edited: 1712231350849,
    },
    id: 'a7af3c10-6cca-4e3b-a051-86c1757e7fd9',
    items: [],
    createdAt: '2024-04-04T11:49:10.821854',
  },
  {
    activityItem: {
      question: {
        en: 'What are your thoughts?',
      },
      responseType: 'multiSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: '67f19318-82d8-482f-a8e8-3f47fcb9d519',
            text: 'Therapy',
            value: 0,
          },
          {
            id: '0f577ae8-dfff-4d0e-b2ce-67f9c5c169ad',
            text: 'Awareness',
            value: 1,
          },
          {
            id: '96316049-5a23-46fc-88bc-e4b9bc405d2d',
            text: 'Medication',
            value: 2,
          },
        ],
      },
      config: {},
      name: 'ItemMS',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '1e8cf622-c118-45c6-be94-430b762ad290',
      order: 2,
    },
    answer: {
      value: ['2'],
      edited: 1712231350849,
    },
    id: 'a7af3c10-6cca-4e3b-a051-86c1757e7fd9',
    items: [],
    createdAt: '2024-04-04T11:49:10.821854',
  },
  {
    activityItem: {
      question: {
        en: 'Grade an answer.',
      },
      responseType: 'slider',
      responseValues: {
        minLabel: 'Minimum',
        maxLabel: 'Maximum',
        minValue: 1,
        maxValue: 10,
        minImage: '',
        maxImage: '',
        scores: null,
        alerts: null,
      },
      config: {},
      name: 'ItemSlider',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '5d51b0de-c0a7-458e-a912-568bc76bd85c',
      order: 3,
    },
    answer: {
      value: 8,
      edited: 1712231350849,
    },
    id: 'a7af3c10-6cca-4e3b-a051-86c1757e7fd9',
    items: [],
    createdAt: '2024-04-04T11:49:10.821854',
  },
  {
    activityItem: {
      question: {
        en: 'Does the respondent feel good?',
      },
      responseType: 'multiSelect',
      responseValues: {
        paletteName: 'palette1',
        options: [
          {
            id: '3cbb7bba-cc05-40f9-ba8d-89d060846684',
            text: 'I think he is good',
            value: 0,
          },
          {
            id: '33941c2f-e44d-4246-86d1-d7cc69c052d7',
            text: 'I don’t think so',
            value: 1,
          },
          {
            id: '3d7b61b5-befb-4652-acc9-52d35fec666a',
            text: 'I don’t know',
            value: 2,
          },
        ],
      },
      config: {},
      name: 'ItemMS2',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '35f0e007-2d43-4f1e-a906-229c4c0b57bc',
      order: 4,
    },
    answer: {
      value: ['2'],
      edited: 1712231350849,
    },
    id: 'a7af3c10-6cca-4e3b-a051-86c1757e7fd9',
    items: [],
    createdAt: '2024-04-04T11:49:10.821854',
  },
  {
    activityItem: {
      question: {
        en: 'Do you like how the respondent passed \nthe review?',
      },
      responseType: 'singleSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: 'b08c3cbe-02fd-434f-822d-a439ad57af3c',
            text: 'Never',
            value: 0,
          },
          {
            id: '5dd2aabe-54c1-4d9b-bcda-9d8369259d14',
            text: 'Sometimes',
            value: 1,
          },
          {
            id: '2b364e29-ef63-49a0-8851-e2e2ac4b714b',
            text: 'Often',
            value: 2,
          },
        ],
      },
      config: {},
      name: 'ItemSS2',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'f17a2abd-c383-40f5-a8d6-571e628967c6',
      order: 5,
    },
    answer: {
      value: '2',
      edited: 1712231350849,
    },
    id: 'a7af3c10-6cca-4e3b-a051-86c1757e7fd9',
    items: [],
    createdAt: '2024-04-04T11:49:10.821854',
  },
] as unknown as AssessmentActivityItem[];
const dataTestid = 'feedback-reviewer';

const renderComponent = (props?: Partial<FeedbackReviewerProps>) =>
  renderWithProviders(
    <FeedbackReviewer
      review={mockedReview}
      reviewer={mockedReviewer}
      isCurrentUserReviewer={false}
      reviewId="review-id"
      createdAt={mockedCreatedAt}
      onReviewerAnswersRemove={mockedOnReviewAnswerRemove}
      error={null}
      isLoading={false}
      data-testid={dataTestid}
      {...props}
    />,
  );

describe('FeedbackReviewer', () => {
  test('should render correctly if current user is reviewer', async () => {
    renderComponent({ isCurrentUserReviewer: true });

    expect(screen.getByText('John Doe (Me)')).toBeInTheDocument();
    expect(screen.getByText('Submitted: Apr 04, 2024 11:49')).toBeInTheDocument();
    const removeButton = screen.getByTestId(`${dataTestid}-answers-remove`);
    expect(removeButton).toBeInTheDocument();

    await userEvent.click(removeButton);
    expect(screen.getByTestId('respondents-feedback-review-remove-popup')).toBeInTheDocument();

    await userEvent.click(
      screen.getByTestId('respondents-feedback-review-remove-popup-submit-button'),
    );
    expect(mockedOnReviewAnswerRemove).toHaveBeenCalledWith({ assessmentId: 'review-id' });
    expect(
      screen.queryByTestId('respondents-feedback-review-remove-popup'),
    ).not.toBeInTheDocument();
  });

  test('should render correctly if reviewer is not current user', async () => {
    renderComponent();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Submitted: Apr 04, 2024 11:49')).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-answers-remove`)).not.toBeInTheDocument();
  });

  test('should render list of reviewer items with answers and show more button, show all on show more button click', async () => {
    renderComponent();

    const collapseButton = screen.getByTestId(`${dataTestid}-collapse`);
    expect(collapseButton).toBeInTheDocument();
    await userEvent.click(collapseButton);

    const reviewerItems = screen.queryAllByTestId(/feedback-reviewer-review-\d+$/);
    expect(reviewerItems).toHaveLength(3);

    const showMoreButton = screen.getByTestId(`${dataTestid}-show-more`);
    expect(showMoreButton).toHaveTextContent('Show 2 more');

    await userEvent.click(showMoreButton);
    expect(showMoreButton).toHaveTextContent('Show less');

    const allReviewerItems = screen.queryAllByTestId(/feedback-reviewer-review-\d+$/);
    expect(allReviewerItems).toHaveLength(5);

    await userEvent.click(showMoreButton);
    expect(showMoreButton).toHaveTextContent('Show 2 more');
  });
});
