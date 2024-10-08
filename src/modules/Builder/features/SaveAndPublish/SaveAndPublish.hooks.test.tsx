import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { ApiResponseCodes } from 'api';
import { mockedApplet, mockedAppletId, mockedSimpleAppletFormData } from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { expectBanner } from 'shared/utils';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { SaveAndPublishSteps } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { useSaveAndPublishSetup } from './SaveAndPublish.hooks';
import type { SaveAndPublishSetup } from './SaveAndPublish.types';

jest.mock('modules/Builder/hooks', () => ({
  useCustomFormContext: () => ({
    trigger: () => true,
    formState: {
      dirtyFields: [],
      isDirty: true,
    },
    getValues: () => mockedSimpleAppletFormData,
  }),
  useAppletPrivateKeySetter: jest.fn(),
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('useSaveAndPublishSetup hook', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: true,
      },
      resetLDContext: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockAxios.reset();
  });

  describe('handleSaveAndPublishFirstClick', () => {
    describe('creating a new applet', () => {
      test('should show a success banner if call to save succeeds', async () => {
        mockAxios.post.mockResolvedValueOnce({ data: {} });

        const { result, store } = renderHookWithProviders(useSaveAndPublishSetup, {
          preloadedState: getPreloadedState(),
          route: '/builder/new-applet/about',
          routePath: '/builder/new-applet/about',
        });

        await (result.current as SaveAndPublishSetup).handleSaveAndPublishFirstClick();

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
            result: mockedApplet,
          },
        });

        const { result, store } = renderHookWithProviders(useSaveAndPublishSetup, {
          preloadedState: getPreloadedState(),
          route: `/builder/${mockedAppletId}/about`,
          routePath: `/builder/:appletId/about`,
        });

        await (result.current as SaveAndPublishSetup).handleSaveAndPublishFirstClick();

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
