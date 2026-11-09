// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { generatePath } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { page } from 'resources';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { mockedAppletFormData } from 'shared/mock';
import { ItemResponseType } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { Unity } from './Unity';

const mockedTestid = 'builder-activity-unity';
const uploadButtonTestid = 'builder-activity-unity-file-modal-button';
const autoAssignTestid = 'builder-activity-unity-auto-assign';
const fileFieldName = 'activities.0.items.0.config.file';
const autoAssignFieldName = 'activities.0.autoAssign';

vi.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn(),
}));

const mockUseFeatureFlags = vi.mocked(useFeatureFlags);

type RenderOptions = {
  file?: string | null;
  autoAssign?: boolean;
};

const getFormDataWithUnity = ({ file = null, autoAssign = true }: RenderOptions) => ({
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
          config: { deviceType: 'mobile', file },
        },
      ],
    },
  ],
});

const renderUnity = (options: RenderOptions = {}) => {
  const ref = createRef();
  const formData = getFormDataWithUnity(options);
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

const getPreview = () =>
  screen.getByTestId('builder-activity-unity-file-uploader').querySelector('textarea');

const getFileInput = () => screen.getByTestId(mockedTestid).querySelector('input[type="file"]');

const getAutoAssignCheckbox = () =>
  screen.getByTestId(autoAssignTestid).querySelector('input[type="checkbox"]');

const uploadFile = async (content: string, name = 'merit_activity.txt') => {
  await userEvent.click(screen.getByTestId(uploadButtonTestid));
  await userEvent.upload(getFileInput(), new File([content], name, { type: 'text/plain' }));
  await userEvent.click(screen.getByTestId(`${mockedTestid}-submit-button`));
};

describe('Unity', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: { enableActivityAssign: true },
      resetLDContext: vi.fn(),
    });
  });

  test('shows Upload File and no preview when there is no config file', () => {
    renderUnity({ file: null });

    expect(screen.getByTestId(uploadButtonTestid)).toHaveTextContent('Upload File');
    expect(screen.getByTestId(uploadButtonTestid).querySelector('.svg-add')).toBeInTheDocument();
    expect(getPreview()).not.toBeInTheDocument();
  });

  test('shows the preview and Update File when a config file exists', () => {
    renderUnity({ file: '{"m_sTaskName": "AB Trails"}' });

    expect(screen.getByTestId(uploadButtonTestid)).toHaveTextContent('Update File');
    expect(screen.getByTestId(uploadButtonTestid).querySelector('.svg-edit')).toBeInTheDocument();
    expect(getPreview()).toHaveValue('{"m_sTaskName": "AB Trails"}');
  });

  test('uploads a file when the saved config file is null', async () => {
    const ref = renderUnity({ file: null });

    await uploadFile('{"m_sTaskName": "New"}');

    await waitFor(() =>
      expect(ref.current.getValues(fileFieldName)).toBe('{"m_sTaskName": "New"}'),
    );
    expect(getPreview()).toHaveValue('{"m_sTaskName": "New"}');
    expect(screen.getByTestId(uploadButtonTestid)).toHaveTextContent('Update File');
  });

  test('replaces an existing config file and marks the field dirty', async () => {
    const ref = renderUnity({ file: '{"m_sTaskName": "Old"}' });

    await uploadFile('{"m_sTaskName": "New"}');

    await waitFor(() =>
      expect(ref.current.getValues(fileFieldName)).toBe('{"m_sTaskName": "New"}'),
    );
    expect(ref.current.formState.dirtyFields.activities[0].items[0].config.file).toBe(true);
  });

  describe('upload modal', () => {
    test('disables Upload until a file is selected', async () => {
      renderUnity({ file: null });

      await userEvent.click(screen.getByTestId(uploadButtonTestid));

      const submitButton = screen.getByTestId(`${mockedTestid}-submit-button`);
      expect(submitButton).toHaveTextContent('Upload');
      expect(submitButton).toBeDisabled();

      await userEvent.upload(
        getFileInput(),
        new File(['content'], 'merit_activity.txt', { type: 'text/plain' }),
      );
      expect(submitButton).toBeEnabled();
    });

    test('clears the previously selected file when reopened', async () => {
      renderUnity({ file: null });

      await uploadFile('{"m_sTaskName": "First"}');
      await waitFor(() =>
        expect(screen.getByTestId(uploadButtonTestid)).toHaveTextContent('Update File'),
      );

      await userEvent.click(screen.getByTestId(uploadButtonTestid));

      expect(screen.getByTestId(`${mockedTestid}-submit-button`)).toBeDisabled();
    });

    test('clears the selected file when closed without uploading', async () => {
      const ref = renderUnity({ file: null });

      await userEvent.click(screen.getByTestId(uploadButtonTestid));
      await userEvent.upload(
        getFileInput(),
        new File(['content'], 'merit_activity.txt', { type: 'text/plain' }),
      );
      await userEvent.click(screen.getByTestId(`${mockedTestid}-close-button`));

      await userEvent.click(screen.getByTestId(uploadButtonTestid));

      expect(screen.getByTestId(`${mockedTestid}-submit-button`)).toBeDisabled();
      expect(ref.current.getValues(fileFieldName)).toBeNull();
    });
  });

  describe('auto-assign checkbox', () => {
    test('reflects the saved autoAssign value', () => {
      renderUnity({ autoAssign: false });

      expect(getAutoAssignCheckbox()).not.toBeChecked();
    });

    test('updates autoAssign when toggled', async () => {
      const ref = renderUnity({ autoAssign: true });

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
