// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { generatePath } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { page } from 'resources';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { mockedAppletFormData } from 'shared/mock';
import { ItemResponseType } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { Unity } from './Unity';

const autoAssignTestid = 'builder-activity-unity-auto-assign';
const autoAssignFieldName = 'activities.0.autoAssign';

vi.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn(),
}));

const mockUseFeatureFlags = vi.mocked(useFeatureFlags);

const getFormDataWithUnity = (autoAssign: boolean) => ({
  ...mockedAppletFormData,
  activities: [
    {
      name: 'MERIT Task',
      description: '',
      isHidden: false,
      autoAssign,
      isPerformanceTask: true,
      performanceTaskType: 'unity',
      id: 'unity-activity-id',
      key: 'unity-activity-key',
      items: [
        {
          id: 'unity-item-id',
          key: 'unity-item-key',
          name: 'unity_mobile',
          question: 'Upload Configurations',
          responseType: ItemResponseType.Unity,
          config: { deviceType: 'mobile', file: null },
        },
      ],
    },
  ],
});

const renderUnity = (autoAssign = true) => {
  const ref = createRef();
  const formData = getFormDataWithUnity(autoAssign);
  const routePath = page.builderAppletUnity;

  renderWithAppletFormData({
    formRef: ref,
    children: <Unity />,
    appletFormData: formData,
    options: {
      routePath,
      route: generatePath(routePath, {
        appletId: formData.id,
        activityId: formData.activities[0].id,
      }),
    },
  });

  return ref;
};

const getAutoAssignCheckbox = () =>
  screen.getByTestId(autoAssignTestid).querySelector('input[type="checkbox"]');

describe('Unity', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: { enableActivityAssign: true },
      resetLDContext: vi.fn(),
    });
  });

  describe('auto-assign checkbox', () => {
    test('reflects the saved autoAssign value', () => {
      renderUnity(false);

      expect(getAutoAssignCheckbox()).not.toBeChecked();
    });

    test('updates autoAssign when toggled', async () => {
      const ref = renderUnity(true);

      expect(getAutoAssignCheckbox()).toBeChecked();

      await userEvent.click(getAutoAssignCheckbox());

      expect(getAutoAssignCheckbox()).not.toBeChecked();
      expect(ref.current.getValues(autoAssignFieldName)).toBe(false);
    });

    test('is hidden when activity assign is disabled', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableActivityAssign: false },
        resetLDContext: vi.fn(),
      });

      renderUnity();

      expect(screen.queryByTestId(autoAssignTestid)).not.toBeInTheDocument();
    });
  });
});
