// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { act, renderHook } from '@testing-library/react';
import { useFormContext } from 'react-hook-form';

import { useAsync } from 'shared/hooks/useAsync';
import {
  getReviewsApi,
  deleteReviewApi,
  deleteFlowReviewApi,
  getFlowReviewsApi,
} from 'modules/Dashboard/api';

import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { useFeedbackReviewsData } from '../useFeedbackReviewsData/useFeedbackReviewsData';
import { useFeedbackReviews } from './useFeedbackReviews';

vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn(),
}));

vi.mock('shared/hooks/useAsync', () => ({
  useAsync: vi.fn(),
}));

vi.mock('modules/Dashboard/api', () => ({
  getReviewsApi: vi.fn(),
  getFlowReviewsApi: vi.fn(),
  deleteReviewApi: vi.fn(),
  deleteFlowReviewApi: vi.fn(),
}));

vi.mock('../useFeedbackReviewsData/useFeedbackReviewsData', () => ({
  useFeedbackReviewsData: vi.fn(),
}));

const mockContextValue = {
  assessment: [
    {
      activityItem: {
        question: {
          en: 'A-123',
        },
        responseType: 'multiSelect',
        responseValues: {
          type: 'multiSelect',
          options: [
            {
              id: 'd79a89a2-d6ce-44db-8ff7-3033b1826514',
              text: 'A123',
              value: 0,
              isNoneAbove: false,
            },
            {
              id: '9cb16928-b20e-4c8d-84d5-131c44cd2c90',
              text: 'A456',
              value: 1,
              isNoneAbove: false,
            },
            {
              id: 'f33efef3-bffb-4880-9a96-b7f287dd6533',
              text: 'None',
              value: 2,
              isNoneAbove: true,
            },
          ],
        },
        name: 'ItemA-123',
        id: 'e6c03f46-d6de-4a3c-8456-c87fdf6d8650',
        order: 1,
      },
    },
  ],
  lastAssessment: [],
  setAssessment: vi.fn(),
  setIsLastVersion: vi.fn(),
  isBannerVisible: false,
  setIsBannerVisible: vi.fn(),
};

const renderUseFeedbackReviewsHook = (useFeedbackReviewsProps) =>
  renderHook(() => useFeedbackReviews(useFeedbackReviewsProps), {
    wrapper: ({ children }) => (
      <RespondentDataReviewContext.Provider value={mockContextValue}>
        {children}
      </RespondentDataReviewContext.Provider>
    ),
  });

describe('useFeedbackReviews', () => {
  const mockUseFormContext = {
    reset: vi.fn(),
  };

  const mockFetchReviewsData = vi.fn();
  const mockAssessment = [
    {
      activityItem: {
        id: 'e6c03f46-d6de-4a3c-8456-c87fdf6d8650',
        name: 'ItemA-123',
        order: 1,
        question: { en: 'A-123' },
        responseType: 'multiSelect',
        responseValues: {
          options: [
            {
              id: 'd79a89a2-d6ce-44db-8ff7-3033b1826514',
              isNoneAbove: false,
              text: 'A123',
              value: 0,
            },
            {
              id: '9cb16928-b20e-4c8d-84d5-131c44cd2c90',
              isNoneAbove: false,
              text: 'A456',
              value: 1,
            },
            {
              id: 'f33efef3-bffb-4880-9a96-b7f287dd6533',
              isNoneAbove: true,
              text: 'None',
              value: 2,
            },
          ],
          type: 'multiSelect',
        },
      },
      answer: undefined,
      items: undefined,
    },
  ];

  beforeEach(() => {
    (useFormContext as jest.Mock).mockReturnValue(mockUseFormContext);
    (useFeedbackReviewsData as jest.Mock).mockReturnValue({
      fetchReviewsData: mockFetchReviewsData,
    });

    (useAsync as jest.Mock).mockImplementation((apiFunction, onSuccess) => ({
      execute: vi.fn(async (params) => {
        const result = await apiFunction(params);
        await onSuccess(result);
      }),
      isLoading: false,
      error: null,
    }));
  });

  test('should fetch reviews correctly', async () => {
    const mockReviewsResult = { data: { result: [{ id: 1, answer: 'encrypted answer' }] } };
    (getReviewsApi as jest.Mock).mockResolvedValue(mockReviewsResult);
    mockFetchReviewsData.mockResolvedValue([{ reviewId: 1, reviewer: 'test' }]);

    const { result } = renderUseFeedbackReviewsHook({
      appletId: 'testAppletId',
      answerId: 'testAnswerId',
      submitId: null,
      user: { id: 'testUserId', firstName: 'Jane', lastName: 'Doe' },
      setAssessmentStep: vi.fn(),
    });

    await act(async () => {
      await result.current.handleGetReviews();
    });

    expect(getReviewsApi).toHaveBeenCalledWith({
      appletId: 'testAppletId',
      answerId: 'testAnswerId',
    });

    expect(mockFetchReviewsData).toHaveBeenCalledWith({
      reviews: [{ id: 1, answer: 'encrypted answer' }],
      userId: 'testUserId',
    });

    expect(result.current.reviewersData).toEqual([{ reviewId: 1, reviewer: 'test' }]);
  });

  test('should handle review removal correctly (activity)', async () => {
    (deleteReviewApi as jest.Mock).mockResolvedValue({});
    (getReviewsApi as jest.Mock).mockResolvedValue({ data: { result: [] } });
    mockFetchReviewsData.mockResolvedValue([]);

    const { result } = renderUseFeedbackReviewsHook({
      appletId: 'testAppletId',
      answerId: 'testAnswerId',
      submitId: null,
      user: { id: 'testUserId', firstName: 'Jane', lastName: 'Doe' },
      setAssessmentStep: vi.fn(),
    });

    await act(async () => {
      await result.current.handleReviewerAnswersRemove('testAssessmentId');
    });

    expect(deleteReviewApi).toHaveBeenCalledWith({
      appletId: 'testAppletId',
      answerId: 'testAnswerId',
      assessmentId: 'testAssessmentId',
    });
    expect(mockContextValue.setAssessment).toHaveBeenCalledWith(mockAssessment);
    expect(result.current.removeReviewsLoading).toBe(false);
    expect(getReviewsApi).toHaveBeenCalledWith({
      answerId: 'testAnswerId',
      appletId: 'testAppletId',
    });
  });

  test('should handle review removal correctly (activity flow)', async () => {
    (deleteFlowReviewApi as jest.Mock).mockResolvedValue({});
    (getFlowReviewsApi as jest.Mock).mockResolvedValue({ data: { result: [] } });
    mockFetchReviewsData.mockResolvedValue([]);

    const { result } = renderUseFeedbackReviewsHook({
      appletId: 'testAppletId',
      answerId: null,
      submitId: 'submitId',
      user: { id: 'testUserId', firstName: 'Jane', lastName: 'Doe' },
      setAssessmentStep: vi.fn(),
    });

    await act(async () => {
      await result.current.handleReviewerAnswersRemove('testAssessmentId');
    });

    expect(deleteFlowReviewApi).toHaveBeenCalledWith({
      appletId: 'testAppletId',
      assessmentId: 'testAssessmentId',
      submitId: 'submitId',
    });

    expect(mockContextValue.setAssessment).toHaveBeenCalledWith(mockAssessment);
    expect(result.current.removeReviewsLoading).toBe(false);
    expect(getFlowReviewsApi).toHaveBeenCalledWith({
      appletId: 'testAppletId',
      submitId: 'submitId',
    });
  });
});
