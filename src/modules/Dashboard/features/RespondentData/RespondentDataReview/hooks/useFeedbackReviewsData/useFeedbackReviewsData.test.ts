// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { renderHook } from '@testing-library/react';

import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { useFeedbackReviewsData } from './useFeedbackReviewsData';
import { GetFeedbackReviewsProps } from '../FeedbackReviews.types';
import { AssessmentActivityItem } from '../../RespondentDataReview.types';

vi.mock('modules/Dashboard/hooks', () => ({
  useDecryptedActivityData: vi.fn(),
}));

describe('useFeedbackReviewsData', () => {
  const mockGetDecryptedActivityData = vi.fn();

  beforeEach(() => {
    (useDecryptedActivityData as jest.Mock).mockReturnValue(mockGetDecryptedActivityData);
  });

  test('should fetch and decrypt review data correctly', async () => {
    mockGetDecryptedActivityData.mockResolvedValue({
      decryptedAnswers: [{ id: 'decryptedActivity1' }] as AssessmentActivityItem[],
    });

    const { result } = renderHook(() => useFeedbackReviewsData());

    const reviews = [
      {
        id: 'review1',
        updatedAt: '2024-05-30',
        reviewerPublicKey: 'publicKey1',
        reviewer: { id: 'user1', name: 'Reviewer1' },
        answer: 'encryptedAnswer1',
      },
      {
        id: 'review2',
        updatedAt: '2024-05-31',
        reviewerPublicKey: null,
        reviewer: { id: 'user2', name: 'Reviewer2' },
        answer: null,
      },
    ];

    const userId = 'user1';
    const fetchReviewsDataProps: GetFeedbackReviewsProps = { reviews, userId };

    const reviewsData = await result.current.fetchReviewsData(fetchReviewsDataProps);

    expect(reviewsData).toEqual([
      {
        reviewId: 'review1',
        updatedAt: '2024-05-30',
        isCurrentUserReviewer: true,
        reviewer: { id: 'user1', name: 'Reviewer1' },
        review: [{ id: 'decryptedActivity1' }],
      },
      {
        reviewId: 'review2',
        updatedAt: '2024-05-31',
        isCurrentUserReviewer: false,
        reviewer: { id: 'user2', name: 'Reviewer2' },
        review: null,
      },
    ]);

    expect(mockGetDecryptedActivityData).toHaveBeenCalledWith({
      id: 'review1',
      updatedAt: '2024-05-30',
      userPublicKey: 'publicKey1',
      answer: 'encryptedAnswer1',
    });
  });

  test('should handle reviews without encrypted data', async () => {
    const { result } = renderHook(() => useFeedbackReviewsData());

    const reviews = [
      {
        id: 'review1',
        updatedAt: '2024-05-31',
        reviewerPublicKey: null,
        reviewer: { id: 'user1', name: 'Reviewer1' },
        answer: null,
      },
    ];

    const userId = 'user2';
    const fetchReviewsDataProps: GetFeedbackReviewsProps = { reviews, userId };

    const reviewsData = await result.current.fetchReviewsData(fetchReviewsDataProps);

    expect(reviewsData).toEqual([
      {
        reviewId: 'review1',
        updatedAt: '2024-05-31',
        isCurrentUserReviewer: false,
        reviewer: { id: 'user1', name: 'Reviewer1' },
        review: null,
      },
    ]);

    expect(mockGetDecryptedActivityData).not.toHaveBeenCalled();
  });

  test('should prioritize current user reviews', async () => {
    mockGetDecryptedActivityData.mockResolvedValue({
      decryptedAnswers: [{ id: 'decryptedActivity1' }] as AssessmentActivityItem[],
    });

    const { result } = renderHook(() => useFeedbackReviewsData());

    const reviews = [
      {
        id: 'review2',
        updatedAt: '2024-05-30',
        reviewerPublicKey: 'publicKey2',
        reviewer: { id: 'user2', name: 'Reviewer2' },
        answer: 'encryptedAnswer2',
      },
      {
        id: 'review1',
        updatedAt: '2024-05-31',
        reviewerPublicKey: 'publicKey1',
        reviewer: { id: 'user1', name: 'Reviewer1' },
        answer: 'encryptedAnswer1',
      },
    ];

    const userId = 'user1';
    const fetchReviewsDataProps: GetFeedbackReviewsProps = { reviews, userId };

    const reviewsData = await result.current.fetchReviewsData(fetchReviewsDataProps);

    expect(reviewsData).toEqual([
      {
        reviewId: 'review1',
        updatedAt: '2024-05-31',
        isCurrentUserReviewer: true,
        reviewer: { id: 'user1', name: 'Reviewer1' },
        review: [{ id: 'decryptedActivity1' }],
      },
      {
        reviewId: 'review2',
        updatedAt: '2024-05-30',
        isCurrentUserReviewer: false,
        reviewer: { id: 'user2', name: 'Reviewer2' },
        review: [{ id: 'decryptedActivity1' }],
      },
    ]);

    expect(mockGetDecryptedActivityData).toHaveBeenCalledWith({
      id: 'review1',
      updatedAt: '2024-05-31',
      userPublicKey: 'publicKey1',
      answer: 'encryptedAnswer1',
    });
  });
});
