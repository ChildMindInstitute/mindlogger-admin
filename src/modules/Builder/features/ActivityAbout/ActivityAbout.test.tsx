// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { page } from 'resources';
import { Roles } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import {
  mockedActivityId,
  mockedApplet,
  mockedAppletFormData,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedMultiSelectFormValues,
  mockedSingleSelectFormValues,
  mockedSliderFormValues,
} from 'shared/mock';
import { initialStateData } from 'shared/state';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';

import { ActivityAbout } from './ActivityAbout';

const route = `/builder/${mockedAppletId}/activities/${mockedActivityId}/about`;
const routePath = page.builderAppletActivityAbout;

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
  themes: {
    themes: {
      ...initialStateData,
      data: {
        result: [
          {
            name: 'Default',
            logo: null,
            backgroundImage: null,
            primaryColor: '#00639a',
            secondaryColor: '#fff',
            tertiaryColor: '#404040',
            id: '9b023afd-e5f9-403c-b154-fc8f35fcf3ab',
            public: true,
            allowRename: true,
          },
        ],
      },
    },
  },
};

const appletFormData = {
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      items: [mockedSingleSelectFormValues, mockedMultiSelectFormValues, mockedSliderFormValues],
      showAllAtOnce: true,
      isSkippable: true,
      responseIsEditable: false,
    },
  ],
};

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('ActivityAbout', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableActivityAssign: true,
      },
      resetLDContext: jest.fn(),
    });
  });

  test('should render all fields for a new applet', () => {
    const route = `/builder/new-applet/activities/${mockedActivityId}/about`;
    renderWithAppletFormData({
      children: <ActivityAbout />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath, preloadedState },
    });

    const fieldsDataTestIds = [
      'builder-activity-about-name',
      'builder-activity-about-description',
      'builder-activity-about-image',
      'builder-activity-about-splash-screen',
      'builder-activity-about-skippable',
      'builder-activity-about-response-editable',
      'builder-activity-about-reviewable',
      'builder-activity-about-auto-assign',
    ];

    fieldsDataTestIds.forEach((dataTestId) =>
      expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
    );
  });

  test('should render all fields for exisiting applet with default values', () => {
    renderWithAppletFormData({
      children: <ActivityAbout />,
      appletFormData,
      options: { route, routePath, preloadedState },
    });

    const activityName = screen.getByLabelText('Activity Name') as HTMLInputElement;
    expect(activityName.value).toBe('New Activity');
    const activityDescription = screen.getByLabelText('Activity Description') as HTMLInputElement;
    expect(activityDescription.value).toBe('');
    const isSkippable = screen.getByLabelText('Allow to skip all items');
    expect(isSkippable).toBeChecked();
    const isEditable = screen.getByLabelText(
      "Disable the respondent's ability to change the response",
    );
    expect(isEditable).toBeChecked();
    const isReviewable = screen.getByLabelText(
      'This Activity is intended for reviewer assessment only',
    );
    expect(isReviewable).not.toBeDisabled();
    const isAutoAssign = screen.getByLabelText('Auto-assign this activity (as self-report)');
    expect(isAutoAssign).toBeChecked();
  });

  test('should hide auto assign checkbox based on feature flag', () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableActivityAssign: false,
      },
      resetLDContext: jest.fn(),
    });

    renderWithAppletFormData({
      children: <ActivityAbout />,
      appletFormData,
      options: { route, routePath, preloadedState },
    });

    expect(screen.queryByLabelText('Auto-assign this activity (as self-report)')).toBeNull();
  });

  test("shouldn't turn activity to reviewer one", () => {
    renderWithAppletFormData({
      children: <ActivityAbout />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    expect(
      screen.getByLabelText('This Activity is intended for reviewer assessment only'),
    ).toBeDisabled();
  });

  test('should validate activity name', async () => {
    renderWithAppletFormData({
      children: <ActivityAbout />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    const appletName = screen.getByLabelText('Activity Name');
    fireEvent.change(appletName, { target: { value: '' } });

    await waitFor(() => expect(screen.getByText('Activity Name is required')).toBeInTheDocument());
  });
});
