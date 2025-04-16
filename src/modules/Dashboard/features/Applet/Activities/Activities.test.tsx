import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse } from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';
import mockAxios from '__mocks__/axios';

import { ApiResponseCodes, WorkspaceManagersResponse, WorkspaceRespondentsResponse } from 'api';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import {
  mockedAppletData,
  mockedAppletId,
  mockedOwnerId,
  mockedOwnerManager,
  mockedFullParticipant1,
  mockedFullParticipant2,
  mockedUserData,
  mockedOwnerParticipant,
  mockedFullParticipant1WithDataAccess,
  mockedFullParticipant2WithDataAccess,
  mockedOwnerParticipantWithDataAccess,
} from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockGetRequestResponses,
  mockSchema,
  mockSuccessfulHttpResponse,
} from 'shared/utils/axios-mocks';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import {
  expectMixpanelTrack,
  openTakeNowModal,
  selectParticipant,
  selfReportCheckboxTestId,
  sourceSubjectDropdownTestId,
  takeNowModalTestId,
  toggleSelfReportCheckbox,
} from 'modules/Dashboard/components/TakeNowModal/TakeNowModal.test-utils';
import { MixpanelEventType, MixpanelProps } from 'shared/utils';
import * as MixpanelFunc from 'shared/utils/mixpanel';

import { Activities } from './Activities';

const successfulEmptyGetAppletActivitiesMock: HttpResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: [],
      appletDetail: {
        ...mockedAppletData,
        activities: [],
      },
    },
  },
};

const successfulGetAppletActivitiesMock: HttpResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: mockedAppletData.activities,
      appletDetail: mockedAppletData,
    },
  },
};

const getAppletUrl = `/applets/${mockedAppletId}`;
const successfulGetAppletMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: { result: mockedAppletData },
};

const successfulEmptyHttpResponseMock: HttpResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
  },
};

const testId = 'dashboard-applet-activities';
const route = `/dashboard/${mockedAppletId}/activities`;
const routePath = page.appletActivities;

const mockedUseNavigate = vi.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

const mixpanelTrack = vi.spyOn(MixpanelFunc.Mixpanel, 'track');

describe('Dashboard > Applet > Activities screen', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParticipantMultiInformant: false,
        enableActivityAssign: false,
      },
      resetLDContext: vi.fn(),
    });
    mixpanelTrack.mockReset();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render empty component', async () => {
    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [`/activities/applet/${mockedAppletId}`]: successfulEmptyGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
        successfulEmptyHttpResponseMock,
    });

    renderWithProviders(<Activities />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });
    await waitFor(() => {
      expect(screen.getByText('Applet has no activities')).toBeInTheDocument();
    });
  });

  test('should render grid with activity summary cards', async () => {
    const getAppletActivitiesUrl = `/activities/applet/${mockedAppletId}`;

    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
        successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState: getPreloadedState() });

    const activities = ['Existing Activity', 'Newly added activity'];

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-grid`)).toBeInTheDocument();
      expect(mockAxios.get).toHaveBeenCalledWith(getAppletActivitiesUrl, expect.any(Object));
      activities.forEach((activity) => expect(screen.getByText(activity)).toBeInTheDocument());
    });
  });

  test('click Add Activity should navigate to Builder > Applet > Activities', async () => {
    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [`/activities/applet/${mockedAppletId}`]: successfulEmptyGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
        successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState: getPreloadedState() });

    const addActivityLink = screen.getByTestId(`${testId}-add-activity`);
    expect(addActivityLink).toHaveAttribute(
      'href',
      generatePath(page.builderAppletActivities, { appletId: mockedAppletId }),
    );
  });

  describe('should show or hide edit ability depending on role', () => {
    test.each`
      canEdit  | role                 | description
      ${true}  | ${Roles.Manager}     | ${'editing for Manager'}
      ${true}  | ${Roles.SuperAdmin}  | ${'editing for SuperAdmin'}
      ${true}  | ${Roles.Owner}       | ${'editing for Owner'}
      ${false} | ${Roles.Coordinator} | ${'editing for Coordinator'}
      ${true}  | ${Roles.Editor}      | ${'editing for Editor'}
      ${false} | ${Roles.Respondent}  | ${'editing for Respondent'}
      ${false} | ${Roles.Reviewer}    | ${'editing for Reviewer'}
    `('$description', async ({ canEdit, role }) => {
      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
          successfulEmptyHttpResponseMock,
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
          successfulEmptyHttpResponseMock,
      });
      renderWithProviders(<Activities />, {
        preloadedState: getPreloadedState(role),
        route,
        routePath,
      });

      // Wait for networks requests to resolve
      await waitFor(() =>
        expect(screen.getAllByTestId(`${testId}-activity-actions-dots`).length).toBeGreaterThan(0),
      );

      const actionDots = screen.queryAllByTestId(`${testId}-activity-actions-dots`)[0];
      if (actionDots && canEdit) {
        userEvent.click(actionDots);
        await waitFor(() => expect(screen.getByTestId(`${testId}-activity-edit`)).toBeVisible());

        fireEvent.click(screen.getByTestId(`${testId}-activity-edit`));
        expect(mockedUseNavigate).toHaveBeenCalledWith(
          generatePath(page.builderAppletActivity, {
            appletId: mockedAppletId,
            activityId: mockedAppletData.activities[0].id,
          }),
        );
      } else {
        await waitFor(() => expect(screen.queryByTestId(`${testId}-activity-edit`)).toBe(null));
      }
    });
  });

  test('click Assign Activity more menu item should trigger Mixpanel event', async () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        ...mockUseFeatureFlags().featureFlags,
        enableActivityAssign: true,
      },
      resetLDContext: vi.fn(),
    });

    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
        successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });

    // Wait for networks requests to resolve
    await waitFor(() =>
      expect(screen.getAllByTestId(`${testId}-activity-actions-dots`).length).toBeGreaterThan(0),
    );

    const actionDots = screen.queryAllByTestId(`${testId}-activity-actions-dots`)[0];
    await userEvent.click(actionDots);

    await waitFor(() => expect(screen.getByTestId(`${testId}-activity-assign`)).toBeVisible());

    fireEvent.click(screen.getByTestId(`${testId}-activity-assign`));

    expect(mixpanelTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        action: MixpanelEventType.StartAssignActivityOrFlow,
        [MixpanelProps.AppletId]: mockedAppletId,
        [MixpanelProps.ActivityId]: mockedAppletData.activities[0].id,
        [MixpanelProps.EntityType]: 'activity',
        [MixpanelProps.Via]: 'Applet - Activities',
      }),
    );
  });

  test('click Assign Flow more menu item should trigger Mixpanel event', async () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        ...mockUseFeatureFlags().featureFlags,
        enableActivityAssign: true,
      },
      resetLDContext: vi.fn(),
    });

    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
        successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });

    // Wait for networks requests to resolve
    await waitFor(() =>
      expect(screen.getAllByTestId(`${testId}-flow-card-actions-dots`).length).toBeGreaterThan(0),
    );

    const actionDots = screen.queryAllByTestId(`${testId}-flow-card-actions-dots`)[0];
    await userEvent.click(actionDots);

    await waitFor(() => expect(screen.getByTestId(`${testId}-flow-assign`)).toBeVisible());

    fireEvent.click(screen.getByTestId(`${testId}-flow-assign`));

    expect(mixpanelTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        action: MixpanelEventType.StartAssignActivityOrFlow,
        [MixpanelProps.AppletId]: mockedAppletId,
        [MixpanelProps.ActivityFlowId]: mockedAppletData.activityFlows[0].id,
        [MixpanelProps.EntityType]: 'flow',
        [MixpanelProps.Via]: 'Applet - Activities',
      }),
    );
  });

  test('click Assign toolbar button should trigger Mixpanel event', async () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        ...mockUseFeatureFlags().featureFlags,
        enableActivityAssign: true,
      },
      resetLDContext: vi.fn(),
    });

    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
        successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });

    fireEvent.click(screen.getByTestId(`${testId}-assign`));

    expect(mixpanelTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        action: MixpanelEventType.StartAssignActivityOrFlow,
        [MixpanelProps.AppletId]: mockedAppletId,
        [MixpanelProps.Via]: 'Applet - Activities',
      }),
    );
  });

  describe('Take now modal', () => {
    const successfulGetAppletParticipantsMock =
      mockSuccessfulHttpResponse<WorkspaceRespondentsResponse>({
        result: [
          mockedFullParticipant1WithDataAccess,
          mockedFullParticipant2WithDataAccess,
          mockedOwnerParticipantWithDataAccess,
        ],
        count: 3,
      });

    const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<WorkspaceManagersResponse>({
      result: [mockedOwnerManager],
      count: 1,
    });

    const renderOptions = {
      preloadedState: {
        ...getPreloadedState(),
        auth: {
          authentication: mockSchema({
            user: mockedUserData,
          }),
          isAuthorized: true,
          isLogoutInProgress: false,
        },
      },
      route,
      routePath,
    };

    beforeEach(() => {
      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]: (params) => {
          if (params.userId === mockedOwnerParticipant.id) {
            return mockSuccessfulHttpResponse<WorkspaceRespondentsResponse>({
              result: [mockedOwnerParticipantWithDataAccess],
              count: 1,
            });
          }

          return successfulGetAppletParticipantsMock;
        },
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
          successfulGetAppletManagersMock,
      });
    });

    describe('should show or hide Take Now button depending on role', () => {
      test.each`
        canDoTakeNow | role                 | description
        ${true}      | ${Roles.Manager}     | ${'Take Now for Manager'}
        ${true}      | ${Roles.SuperAdmin}  | ${'Take Now for SuperAdmin'}
        ${true}      | ${Roles.Owner}       | ${'Take Now for Owner'}
        ${false}     | ${Roles.Coordinator} | ${'Take Now for Coordinator'}
        ${false}     | ${Roles.Editor}      | ${'Take Now for Editor'}
        ${false}     | ${Roles.Respondent}  | ${'Take Now for Respondent'}
        ${false}     | ${Roles.Reviewer}    | ${'Take Now for Reviewer'}
      `('$description', async ({ canDoTakeNow, role }: { canDoTakeNow: boolean; role: Roles }) => {
        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
            successfulEmptyHttpResponseMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`]:
            successfulEmptyHttpResponseMock,
        });
        renderWithProviders(<Activities />, {
          preloadedState: getPreloadedState(role),
          route,
          routePath,
        });

        // Wait for networks requests to resolve
        await waitFor(() =>
          expect(screen.getAllByTestId(`${testId}-activity-actions-dots`).length).toBeGreaterThan(
            0,
          ),
        );

        const actionDots = screen.queryAllByTestId(`${testId}-activity-actions-dots`)[0];

        if (actionDots && canDoTakeNow) {
          userEvent.click(actionDots);
          await waitFor(() =>
            expect(screen.getByTestId(`${testId}-activity-take-now`)).toBeVisible(),
          );
        } else {
          await waitFor(() =>
            expect(screen.queryByTestId(`${testId}-activity-take-now`)).toBe(null),
          );
        }
      });
    });

    test('should pre-populate admin in Take Now modal and start assessment', async () => {
      renderWithProviders(<Activities />, renderOptions);

      await openTakeNowModal(testId);

      expectMixpanelTrack({
        action: MixpanelEventType.TakeNowClick,
        [MixpanelProps.Via]: 'Applet - Activities',
      });

      const sourceInputElement = screen
        .getByTestId(sourceSubjectDropdownTestId(testId))
        .querySelector('input');

      expect(sourceInputElement).toHaveValue(
        `${mockedUserData.firstName} ${mockedUserData.lastName} (Team)`,
      );

      selectParticipant(testId, 'target', mockedFullParticipant1.details[0].subjectId);

      expectMixpanelTrack({ action: MixpanelEventType.ResponsesAboutDropdownOpened });
      expectMixpanelTrack({
        action: MixpanelEventType.ResponsesAboutSelectionChanged,
        [MixpanelProps.TargetAccountType]: 'Full',
      });

      const submitButton = screen.getByTestId(`${takeNowModalTestId(testId)}-submit-button`);

      expect(submitButton).not.toBeDisabled();

      fireEvent.click(submitButton);

      expectMixpanelTrack({
        action: MixpanelEventType.MultiInformantStartActivityClick,
        [MixpanelProps.SourceAccountType]: 'Team',
        [MixpanelProps.TargetAccountType]: 'Full',
        [MixpanelProps.InputAccountType]: 'Team',
        [MixpanelProps.IsSelfReporting]: true,
      });
    });

    describe('featureFlags.enableParticipantMultiInformant = false', () => {
      test('Full account participants cannot input own responses', async () => {
        const { getByTestId } = renderWithProviders(<Activities />, renderOptions);

        await openTakeNowModal(testId);

        selectParticipant(testId, 'source', mockedFullParticipant1.details[0].subjectId);

        expectMixpanelTrack({ action: MixpanelEventType.ProvidingResponsesDropdownOpened });
        expectMixpanelTrack({
          action: MixpanelEventType.ProvidingResponsesSelectionChanged,
          [MixpanelProps.SourceAccountType]: 'Full',
        });

        const checkbox = getByTestId(selfReportCheckboxTestId(testId)).querySelector('input');

        expect(checkbox).toBeDisabled();
      });

      test('Full account participants are not present in the inputting dropdown', async () => {
        const { getByTestId, getByRole } = renderWithProviders(<Activities />, renderOptions);

        await openTakeNowModal(testId);

        await selectParticipant(testId, 'source', mockedOwnerParticipant.details[0].subjectId);

        expectMixpanelTrack({ action: MixpanelEventType.ProvidingResponsesDropdownOpened });
        expectMixpanelTrack({
          action: MixpanelEventType.ProvidingResponsesSelectionChanged,
          [MixpanelProps.SourceAccountType]: 'Team',
        });

        await toggleSelfReportCheckbox(testId);

        expectMixpanelTrack({
          action: MixpanelEventType.OwnResponsesCheckboxToggled,
          [MixpanelProps.IsSelfReporting]: false,
        });

        const dropdownTestId = `${takeNowModalTestId(testId)}-logged-in-user-dropdown`;

        const inputElement = getByTestId(dropdownTestId).querySelector('input');

        if (inputElement === null) {
          throw new Error('Autocomplete logged-in user dropdown element not found');
        }

        fireEvent.mouseDown(inputElement);

        expectMixpanelTrack({ action: MixpanelEventType.InputtingResponsesDropdownOpened });

        const options = within(getByRole('listbox')).queryAllByRole('option');

        expect(options.length).toBeGreaterThan(0);

        const dropdownOptionTestIdRegex = new RegExp(`^${dropdownTestId}-option-`);
        const optionsText = options.map(
          (option) =>
            option.getAttribute('data-testid')?.replace(dropdownOptionTestIdRegex, '') || '',
        );

        expect(optionsText).not.toContain(mockedFullParticipant1.details[0].subjectId);
        expect(optionsText).not.toContain(mockedFullParticipant2.details[0].subjectId);

        selectParticipant(testId, 'loggedin', mockedOwnerParticipant.details[0].subjectId);

        expectMixpanelTrack({
          action: MixpanelEventType.InputtingResponsesSelectionChanged,
          [MixpanelProps.InputAccountType]: 'Team',
        });
      });
    });

    describe('featureFlags.enableParticipantMultiInformant = true', () => {
      beforeEach(() => {
        mockUseFeatureFlags.mockReturnValue({
          featureFlags: {
            enableParticipantMultiInformant: true,
          },
          resetLDContext: vi.fn(),
        });
      });

      test('Full account participants can input own responses', async () => {
        const { getByTestId } = renderWithProviders(<Activities />, renderOptions);

        await openTakeNowModal(testId);

        await selectParticipant(testId, 'source', mockedOwnerParticipant.details[0].subjectId);

        expectMixpanelTrack({ action: MixpanelEventType.ProvidingResponsesDropdownOpened });
        expectMixpanelTrack({
          action: MixpanelEventType.ProvidingResponsesSelectionChanged,
          [MixpanelProps.SourceAccountType]: 'Team',
        });

        const checkbox = getByTestId(selfReportCheckboxTestId(testId)).querySelector('input');

        expect(checkbox).not.toBeDisabled();
      });

      test('Full account participants are present in the inputting dropdown', async () => {
        const { getByTestId, getByRole } = renderWithProviders(<Activities />, renderOptions);

        await openTakeNowModal(testId);

        await selectParticipant(testId, 'source', mockedOwnerParticipant.details[0].subjectId);

        expectMixpanelTrack({ action: MixpanelEventType.ProvidingResponsesDropdownOpened });
        expectMixpanelTrack({
          action: MixpanelEventType.ProvidingResponsesSelectionChanged,
          [MixpanelProps.SourceAccountType]: 'Team',
        });

        await toggleSelfReportCheckbox(testId);

        expectMixpanelTrack({
          action: MixpanelEventType.OwnResponsesCheckboxToggled,
          [MixpanelProps.IsSelfReporting]: false,
        });

        const dropdownTestId = `${takeNowModalTestId(testId)}-logged-in-user-dropdown`;

        const inputElement = getByTestId(dropdownTestId).querySelector('input');

        if (inputElement === null) {
          throw new Error('Autocomplete logged-in user dropdown element not found');
        }

        fireEvent.mouseDown(inputElement);

        expectMixpanelTrack({ action: MixpanelEventType.InputtingResponsesDropdownOpened });

        const options = within(getByRole('listbox')).queryAllByRole('option');

        expect(options.length).toBeGreaterThan(0);

        const dropdownOptionTestIdRegex = new RegExp(`^${dropdownTestId}-option-`);
        const optionsText = options.map(
          (option) =>
            option.getAttribute('data-testid')?.replace(dropdownOptionTestIdRegex, '') || '',
        );

        expect(optionsText).toContain(mockedFullParticipant1.details[0].subjectId);
        expect(optionsText).toContain(mockedFullParticipant2.details[0].subjectId);
      });

      test('should not pre-populate admin in Take Now modal', async () => {
        renderWithProviders(<Activities />, renderOptions);

        await openTakeNowModal(testId);

        const inputElement = screen
          .getByTestId(`${sourceSubjectDropdownTestId(testId)}`)
          .querySelector('input');

        expect(inputElement).toHaveValue('');
      });
    });
  });
});
