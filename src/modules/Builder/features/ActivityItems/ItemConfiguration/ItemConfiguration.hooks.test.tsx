import { renderHook } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { vi } from 'vitest';

import { ItemResponseType } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { useGetAvailableItemTypeOptions } from './ItemConfiguration.hooks';

vi.mock('react-hook-form', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useWatch: vi.fn(),
  };
});

vi.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn(),
}));

vi.mock('modules/Builder/hooks/useCurrentActivity', () => ({
  useCurrentActivity: vi.fn(),
}));

const mockUseWatch = useWatch as vi.Mock;
const mockUseFeatureFlags = useFeatureFlags as vi.Mock;
const mockUseCurrentActivity = useCurrentActivity as vi.Mock;

const mockSingleSelectionItem = {
  id: 'existing-item-id',
  name: 'existing-item',
  responseType: ItemResponseType.SingleSelection,
  question: 'Existing question',
};

describe('ItemConfiguration hooks', () => {
  describe('useGetAvailableItemTypeOptions', () => {
    beforeEach(() => {
      // Default mocks
      mockUseWatch.mockReturnValue([false, { id: 'test-item-id' }]);
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: {
          enablePhrasalTemplate: true,
          enableParagraphTextItem: true,
          enableEhrHealthData: 'active',
        },
      });
      mockUseCurrentActivity.mockReturnValue({
        fieldName: 'activities.0',
        activity: {
          items: [mockSingleSelectionItem],
        },
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      const methods = useForm({
        defaultValues: {
          'activities.0.items.0': mockSingleSelectionItem,
          'activities.0.isReviewable': false,
        },
      });

      return <FormProvider {...methods}>{children}</FormProvider>;
    };

    test('returns all item types when all feature flags are enabled', () => {
      const { result } = renderHook(() => useGetAvailableItemTypeOptions('activities.0.items.0'), {
        wrapper: Wrapper,
      });

      // Check that PhrasalTemplate is available
      const downloadableGroup = result.current.find((group) => group.groupName === 'downloadable');
      expect(downloadableGroup).toBeDefined();
      const phrasalTemplateOption = downloadableGroup?.groupOptions.find(
        (option) => option.value === ItemResponseType.PhrasalTemplate,
      );
      expect(phrasalTemplateOption).toBeDefined();
      expect(phrasalTemplateOption?.disabled).toBeFalsy();

      // Check that ParagraphText is available
      const inputGroup = result.current.find((group) => group.groupName === 'input');
      expect(inputGroup).toBeDefined();
      const paragraphTextOption = inputGroup?.groupOptions.find(
        (option) => option.value === ItemResponseType.ParagraphText,
      );
      expect(paragraphTextOption).toBeDefined();
      expect(paragraphTextOption?.disabled).toBeFalsy();

      // Check that RequestHealthRecordData is available
      const importGroup = result.current.find((group) => group.groupName === 'import');
      expect(importGroup).toBeDefined();
      const healthRecordOption = importGroup?.groupOptions.find(
        (option) => option.value === ItemResponseType.RequestHealthRecordData,
      );
      expect(healthRecordOption).toBeDefined();
      expect(healthRecordOption?.disabled).toBeFalsy();
    });

    test('hides PhrasalTemplate item type when the feature flag is disabled', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: {
          enablePhrasalTemplate: false,
          enableParagraphTextItem: true,
          enableEhrHealthData: 'active',
        },
      });

      const { result } = renderHook(() => useGetAvailableItemTypeOptions('activities.0.items.0'), {
        wrapper: Wrapper,
      });

      // Check that PhrasalTemplate is not available
      const downloadableGroup = result.current.find((group) => group.groupName === 'downloadable');
      if (downloadableGroup) {
        const phrasalTemplateOption = downloadableGroup.groupOptions.find(
          (option) => option.value === ItemResponseType.PhrasalTemplate,
        );
        expect(phrasalTemplateOption).toBeUndefined();
      }
    });

    test('hides ParagraphText item type when the feature flag is disabled', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: {
          enablePhrasalTemplate: true,
          enableParagraphTextItem: false,
          enableEhrHealthData: 'active',
        },
      });

      const { result } = renderHook(() => useGetAvailableItemTypeOptions('activities.0.items.0'), {
        wrapper: Wrapper,
      });

      // Check that ParagraphText is not available
      const inputGroup = result.current.find((group) => group.groupName === 'input');
      if (inputGroup) {
        const paragraphTextOption = inputGroup.groupOptions.find(
          (option) => option.value === ItemResponseType.ParagraphText,
        );
        expect(paragraphTextOption).toBeUndefined();
      }
    });

    test('hides RequestHealthRecordData item type when the feature flag is not active', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: {
          enablePhrasalTemplate: true,
          enableParagraphTextItem: true,
          enableEhrHealthData: 'unavailable',
        },
      });

      const { result } = renderHook(() => useGetAvailableItemTypeOptions('activities.0.items.0'), {
        wrapper: Wrapper,
      });

      // Check that RequestHealthRecordData is not available
      const importGroup = result.current.find((group) => group.groupName === 'import');
      if (importGroup) {
        const healthRecordOption = importGroup.groupOptions.find(
          (option) => option.value === ItemResponseType.RequestHealthRecordData,
        );
        expect(healthRecordOption).toBeUndefined();
      }
    });

    test('disables RequestHealthRecordData item type when one already exists in the activity', () => {
      // Create a mock activity with a RequestHealthRecordData item
      mockUseCurrentActivity.mockReturnValue({
        fieldName: 'activities.0',
        activity: {
          items: [
            mockSingleSelectionItem,
            {
              id: 'existing-health-record-item',
              name: 'existing-health-record',
              responseType: ItemResponseType.RequestHealthRecordData,
              question: 'Existing health record question',
            },
          ],
        },
      });

      const { result } = renderHook(() => useGetAvailableItemTypeOptions('activities.0.items.0'), {
        wrapper: Wrapper,
      });

      // Check that RequestHealthRecordData is available but disabled
      const importGroup = result.current.find((group) => group.groupName === 'import');
      expect(importGroup).toBeDefined();
      const healthRecordOption = importGroup?.groupOptions.find(
        (option) => option.value === ItemResponseType.RequestHealthRecordData,
      );
      expect(healthRecordOption).toBeDefined();
      expect(healthRecordOption?.disabled).toBeTruthy();
    });

    test('only shows allowed item types for reviewable activities', () => {
      // Set isReviewable to true
      mockUseWatch.mockReturnValue([true, { id: 'test-item-id' }]);

      const { result } = renderHook(() => useGetAvailableItemTypeOptions('activities.0.items.0'), {
        wrapper: Wrapper,
      });

      // Should only have one group - 'select'
      expect(result.current.length).toBe(1);
      expect(result.current[0].groupName).toBe('select');

      // Check that only allowed item types for reviewable activities are shown
      const selectGroup = result.current[0];

      // SingleSelection should be available
      const singleSelectionOption = selectGroup.groupOptions.find(
        (option) => option.value === ItemResponseType.SingleSelection,
      );
      expect(singleSelectionOption).toBeDefined();

      // MultipleSelection should be available
      const multipleSelectionOption = selectGroup.groupOptions.find(
        (option) => option.value === ItemResponseType.MultipleSelection,
      );
      expect(multipleSelectionOption).toBeDefined();

      // Slider should be available
      const sliderOption = selectGroup.groupOptions.find(
        (option) => option.value === ItemResponseType.Slider,
      );
      expect(sliderOption).toBeDefined();

      // Should only have these 3 options
      expect(selectGroup.groupOptions.length).toBe(3);
    });
  });
});
