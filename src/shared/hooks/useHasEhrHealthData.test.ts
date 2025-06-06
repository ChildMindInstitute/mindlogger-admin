import mockAxios from 'jest-mock-axios';
import { waitFor } from '@testing-library/react';

import { ApiResponseCodes } from 'api';
import { mockGetRequestResponses } from 'shared/utils/axios-mocks';
import { mockedAppletId } from 'shared/mock';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';

import { useFeatureFlags } from './useFeatureFlags';
import { useHasEhrHealthData } from './useHasEhrHealthData';

// Mock the hooks that useHasEhrHealthData depends on
jest.mock('./useFeatureFlags');

describe('useHasEhrHealthData', () => {
  const mockUseFeatureFlags = useFeatureFlags as jest.MockedFunction<typeof useFeatureFlags>;
  const GET_APPLET_ACTIVITIES_URL = `/activities/applet/${mockedAppletId}`;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: { enableEhrHealthData: 'available' },
      resetLDContext: jest.fn(),
    });

    // Default mock for activities endpoint - no data
    mockGetRequestResponses({
      [GET_APPLET_ACTIVITIES_URL]: {
        status: ApiResponseCodes.SuccessfulResponse,
        data: {
          result: {
            activitiesDetails: [],
            appletDetail: { activityFlows: [] },
          },
        },
      },
    });
  });

  it('should return false when feature flag is unavailable', () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: { enableEhrHealthData: 'unavailable' },
      resetLDContext: jest.fn(),
    });

    const { result } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId }),
    );

    expect(result.current).toBe(false);
  });

  it('should return false when activities data is not available', () => {
    mockGetRequestResponses({
      [GET_APPLET_ACTIVITIES_URL]: {
        status: ApiResponseCodes.SuccessfulResponse,
        data: {
          result: null,
        },
      },
    });

    const { result } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId }),
    );

    expect(result.current).toBe(false);
  });

  it('should return false when activitiesDetails is empty', () => {
    const { result } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId }),
    );

    expect(result.current).toBe(false);
  });

  it('should return true when an activity contains an EHR item type', () => {
    mockGetRequestResponses({
      [GET_APPLET_ACTIVITIES_URL]: {
        status: ApiResponseCodes.SuccessfulResponse,
        data: {
          result: {
            activitiesDetails: [
              {
                id: 'activity-1',
                items: [{ responseType: 'requestHealthRecordData' }],
              },
              {
                id: 'activity-2',
                items: [{ responseType: 'text' }],
              },
            ],
            appletDetail: { activityFlows: [] },
          },
        },
      },
    });

    const { result } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId }),
    );

    waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should return false when no activity contains an EHR item type', () => {
    mockGetRequestResponses({
      [GET_APPLET_ACTIVITIES_URL]: {
        status: ApiResponseCodes.SuccessfulResponse,
        data: {
          result: {
            activitiesDetails: [
              {
                id: 'activity-1',
                items: [{ responseType: 'text' }],
              },
              {
                id: 'activity-2',
                items: [{ responseType: 'number' }],
              },
            ],
            appletDetail: { activityFlows: [] },
          },
        },
      },
    });

    const { result } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId }),
    );

    expect(result.current).toBe(false);
  });

  it('should filter activities by activityId when provided', () => {
    mockGetRequestResponses({
      [GET_APPLET_ACTIVITIES_URL]: {
        status: ApiResponseCodes.SuccessfulResponse,
        data: {
          result: {
            activitiesDetails: [
              {
                id: 'activity-1',
                items: [{ responseType: 'text' }],
              },
              {
                id: 'activity-2',
                items: [{ responseType: 'requestHealthRecordData' }],
              },
            ],
            appletDetail: { activityFlows: [] },
          },
        },
      },
    });

    // Should return false when the specified activity doesn't have EHR items
    const { result: result1 } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId, activityId: 'activity-1' }),
    );
    expect(result1.current).toBe(false);

    // Should return true when the specified activity has EHR items
    const { result: result2 } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId, activityId: 'activity-2' }),
    );
    waitFor(() => {
      expect(result2.current).toBe(true);
    });

    // Should return false when the specified activity doesn't exist
    const { result: result3 } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId, activityId: 'non-existent' }),
    );
    expect(result3.current).toBe(false);
  });

  it('should filter activities by flowId when provided', () => {
    mockGetRequestResponses({
      [GET_APPLET_ACTIVITIES_URL]: {
        status: ApiResponseCodes.SuccessfulResponse,
        data: {
          result: {
            activitiesDetails: [
              {
                id: 'activity-1',
                items: [{ responseType: 'text' }],
              },
              {
                id: 'activity-2',
                items: [{ responseType: 'requestHealthRecordData' }],
              },
              {
                id: 'activity-3',
                items: [{ responseType: 'text' }],
              },
            ],
            appletDetail: {
              activityFlows: [
                {
                  id: 'flow-1',
                  activityIds: ['activity-1', 'activity-3'],
                },
                {
                  id: 'flow-2',
                  activityIds: ['activity-2'],
                },
              ],
            },
          },
        },
      },
    });

    // Should return false when the specified flow doesn't contain activities with EHR items
    const { result: result1 } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId, flowId: 'flow-1' }),
    );
    expect(result1.current).toBe(false);

    // Should return true when the specified flow contains activities with EHR items
    const { result: result2 } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId, flowId: 'flow-2' }),
    );
    waitFor(() => {
      expect(result2.current).toBe(true);
    });

    // Should return false when the specified flow doesn't exist
    const { result: result3 } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId, flowId: 'non-existent' }),
    );
    expect(result3.current).toBe(false);

    // Should return false when the specified flow has no activities
    mockGetRequestResponses({
      [GET_APPLET_ACTIVITIES_URL]: {
        status: ApiResponseCodes.SuccessfulResponse,
        data: {
          result: {
            activitiesDetails: [
              {
                id: 'activity-1',
                items: [{ responseType: 'requestHealthRecordData' }],
              },
            ],
            appletDetail: {
              activityFlows: [
                {
                  id: 'empty-flow',
                  activityIds: [],
                },
              ],
            },
          },
        },
      },
    });

    const { result: result4 } = renderHookWithProviders(() =>
      useHasEhrHealthData({ appletId: mockedAppletId, flowId: 'empty-flow' }),
    );
    expect(result4.current).toBe(false);
  });

  it('should return false when appletId is not provided', () => {
    const { result } = renderHookWithProviders(() => useHasEhrHealthData({}));
    expect(result.current).toBe(false);
  });

  afterEach(() => {
    mockAxios.reset();
  });
});
