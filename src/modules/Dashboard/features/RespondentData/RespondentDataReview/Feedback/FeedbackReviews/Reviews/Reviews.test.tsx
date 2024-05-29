import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { Reviews } from './Reviews';
import { ReviewsProps } from './Reviews.types';
import { ReviewData } from '../FeedbackReviews.types';

const mockedOnReviewAnswerRemove = jest.fn();
const mockedOnReviewEdit = jest.fn();
const mockedReviewersData = [
  {
    reviewId: 'a7af3c10-6cca-4e3b-a051-86c1757e7fd9',
    updatedAt: '2024-04-04T12:49:10.821854',
    isCurrentUserReviewer: true,
    reviewer: {
      id: '3a765cdf-a67e-490f-a6df-a8984fe7aa5b',
      firstName: 'Name',
      lastName: 'Surname',
    },
    review: [],
  },
  {
    reviewId: 'd9e5d5fa-c0fd-43b0-8d53-426123a0cb44',
    updatedAt: '2024-03-14T14:50:38.637755',
    isCurrentUserReviewer: false,
    reviewer: {
      id: 'c1dbef7d-a790-42d9-ad09-e680eb76af7c',
      firstName: 'John',
      lastName: 'Doe',
    },
    review: [],
  },
  {
    reviewId: '5937e5cb-48bc-453f-9a53-f811024b3cc7',
    updatedAt: '2024-03-14T16:09:13.934448',
    isCurrentUserReviewer: false,
    reviewer: {
      id: '3e26cc77-d458-4b76-bcb7-9b3e0bcda45e',
      firstName: 'Jane',
      lastName: 'Doe',
    },
    review: [],
  },
] as unknown as ReviewData[];
const renderComponent = (props?: Partial<ReviewsProps>) =>
  renderWithProviders(
    <Reviews
      isLoading={false}
      reviewError={null}
      reviewerData={mockedReviewersData}
      removeReviewError={null}
      removeReviewLoading={false}
      onReviewerAnswersRemove={mockedOnReviewAnswerRemove}
      onReviewEdit={mockedOnReviewEdit}
      data-testid="reviews"
      {...props}
    />,
  );

describe('Reviews', () => {
  test('should render spinner when isLoading is true', () => {
    renderComponent({ isLoading: true });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('should render error text when reviewsError is present', () => {
    const errorMessage = 'Error message';
    renderComponent({ reviewError: errorMessage });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('should render FeedbackReviewer components for each reviewerData', () => {
    renderComponent();

    const reviewers = screen.queryAllByTestId(/reviews-reviewer-\d+$/);

    expect(reviewers).toHaveLength(3);
    expect(screen.getByText('Name Surname (Me)')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  test('should return null if no reviewersData', () => {
    const { container } = renderComponent({ reviewerData: [] });

    expect(container.firstChild).toBeNull();
  });
});
