import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { ApiResponseCodes } from 'api';
import { mockedAppletId, mockedSimpleAppletFormData } from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import {
  AppletCreatedSuccessfullyEvent,
  AppletEditSuccessfulEvent,
  AppletSaveClickEvent,
  expectBanner,
  Mixpanel,
  MixpanelEventType,
  MixpanelProps,
} from 'shared/utils';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { SaveAndPublishSteps } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { ItemResponseType } from 'shared/consts';
import { SingleApplet } from 'shared/state';

import { useSaveAndPublishSetup } from './SaveAndPublish.hooks';
import type { SaveAndPublishSetup } from './SaveAndPublish.types';

/* Mocks
=================================================== */
const mockedAppletData = {
  ...mockedSimpleAppletFormData,
  activities: [
    ...mockedSimpleAppletFormData.activities,
    {
      name: 'Auto assigned activity',
      autoAssign: true,
      description: 'Test',
      showAllAtOnce: false,
      isSkippable: false,
      responseIsEditable: true,
      isHidden: false,
      isReviewable: false,
      items: [
        {
          responseType: 'text',
          name: 'Item',
          question: 'Test',
          config: {
            removeBackButton: false,
            skippableItem: false,
            maxResponseLength: 72,
            correctAnswerRequired: false,
            correctAnswer: '',
            numericalResponseRequired: false,
            responseDataIdentifier: false,
            responseRequired: false,
          },
          isHidden: false,
          allowEdit: true,
          key: '03b655eb-6478-45f4-8625-5ef6bf5877db',
          alerts: [],
          responseValues: {},
        },
      ],
      scoresAndReports: {
        generateReport: false,
        reports: [],
        showScoreSummary: false,
      },
      conditionalLogic: [],
      key: 'c913d560-b69d-47ec-828c-eec12c47ca24',
    },
  ],
} as SingleApplet;

jest.mock('modules/Builder/hooks', () => ({
  useCustomFormContext: () => ({
    trigger: () => true,
    formState: {
      dirtyFields: [],
      isDirty: true,
    },
    getValues: () => mockedAppletData,
  }),
  useAppletPrivateKeySetter: jest.fn(),
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

const spyMixpanelTrack = jest.spyOn(Mixpanel, 'track');

/* Utilities
=================================================== */
export const expectMixpanelTrack = (
  event: AppletSaveClickEvent | AppletCreatedSuccessfullyEvent | AppletEditSuccessfulEvent,
) => {
  expect(spyMixpanelTrack).toHaveBeenCalledWith(event);
};

/* Tests
=================================================== */
describe('useSaveAndPublishSetup hook', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: true,
      },
      resetLDContext: jest.fn(),
    });
    spyMixpanelTrack.mockReset();
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockAxios.reset();
  });

  describe('handleSaveAndPublishFirstClick', () => {
    describe('creating a new applet', () => {
      test('should show a success banner if call to save succeeds', async () => {
        mockAxios.post.mockResolvedValueOnce({
          status: ApiResponseCodes.SuccessfulResponse,
          data: {
            result: { ...mockedAppletData, id: mockedAppletId },
          },
        });

        const { result, store } = renderHookWithProviders(useSaveAndPublishSetup, {
          preloadedState: getPreloadedState(),
          route: '/builder/new-applet/about',
          routePath: '/builder/new-applet/about',
        });

        await (result.current as SaveAndPublishSetup).handleSaveAndPublishFirstClick();

        expectMixpanelTrack({
          action: MixpanelEventType.AppletSaveClick,
          [MixpanelProps.AppletId]: undefined,
          [MixpanelProps.AutoAssignedActivityCount]: 1,
          [MixpanelProps.AutoAssignedFlowCount]: 0,
          [MixpanelProps.ManuallyAssignedActivityCount]: 1,
          [MixpanelProps.ManuallyAssignedFlowCount]: 0,
          [MixpanelProps.ItemTypes]: [ItemResponseType.Text],
          [MixpanelProps.ItemCount]: 2,
          [MixpanelProps.PhraseBuilderItemCount]: 0,
          [MixpanelProps.ItemsIncludedInPhraseBuilders]: 0,
          [MixpanelProps.AverageItemsPerPhraseBuilder]: null,
        });

        expectMixpanelTrack({
          action: MixpanelEventType.AppletCreatedSuccessfully,
          [MixpanelProps.AppletId]: mockedAppletId,
          [MixpanelProps.ItemTypes]: [ItemResponseType.Text],
          [MixpanelProps.ItemCount]: 2,
          [MixpanelProps.PhraseBuilderItemCount]: 0,
          [MixpanelProps.ItemsIncludedInPhraseBuilders]: 0,
          [MixpanelProps.AverageItemsPerPhraseBuilder]: null,
        });

        await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));
      });

      test('should not show a success banner if call to save fails', async () => {
        mockAxios.post.mockRejectedValueOnce({});

        const { result, rerender, store } = renderHookWithProviders(useSaveAndPublishSetup, {
          preloadedState: getPreloadedState(),
          route: '/builder/new-applet/about',
          routePath: '/builder/new-applet/about',
        });

        await (result.current as SaveAndPublishSetup).handleSaveAndPublishFirstClick();

        // Ensure hook internal state is updated before checking publishProcessStep
        rerender();

        expect((result.current as SaveAndPublishSetup).publishProcessStep).toBe(
          SaveAndPublishSteps.Failed,
        );

        expectBanner(store, 'SaveSuccessBanner', false);
      });
    });

    describe('updating an existing applet', () => {
      test('should show a success banner if call to save succeeds', async () => {
        mockAxios.put.mockResolvedValueOnce({
          status: ApiResponseCodes.SuccessfulResponse,
          data: {
            result: { ...mockedAppletData, id: mockedAppletId },
          },
        });

        const { result, store } = renderHookWithProviders(useSaveAndPublishSetup, {
          preloadedState: getPreloadedState(),
          route: `/builder/${mockedAppletId}/about`,
          routePath: `/builder/:appletId/about`,
        });

        await (result.current as SaveAndPublishSetup).handleSaveAndPublishFirstClick();

        expectMixpanelTrack({
          action: MixpanelEventType.AppletSaveClick,
          [MixpanelProps.AppletId]: mockedAppletId,
          [MixpanelProps.AutoAssignedActivityCount]: 1,
          [MixpanelProps.AutoAssignedFlowCount]: 0,
          [MixpanelProps.ManuallyAssignedActivityCount]: 1,
          [MixpanelProps.ManuallyAssignedFlowCount]: 0,
          [MixpanelProps.ItemTypes]: [ItemResponseType.Text],
          [MixpanelProps.ItemCount]: 2,
          [MixpanelProps.PhraseBuilderItemCount]: 0,
          [MixpanelProps.ItemsIncludedInPhraseBuilders]: 0,
          [MixpanelProps.AverageItemsPerPhraseBuilder]: null,
        });

        expectMixpanelTrack({
          action: MixpanelEventType.AppletEditSuccessful,
          [MixpanelProps.AppletId]: mockedAppletId,
          [MixpanelProps.ItemTypes]: [ItemResponseType.Text],
          [MixpanelProps.ItemCount]: 2,
          [MixpanelProps.PhraseBuilderItemCount]: 0,
          [MixpanelProps.ItemsIncludedInPhraseBuilders]: 0,
          [MixpanelProps.AverageItemsPerPhraseBuilder]: null,
        });

        await waitFor(() =>
          expect(
            store.getState().banners.data.banners.find((payload) => {
              const bannerContent = payload.bannerProps?.children;
              if (bannerContent) {
                return bannerContent.toString().includes('updated');
              }

              return false;
            }),
          ).toBeDefined(),
        );
      });
    });
  });
});
