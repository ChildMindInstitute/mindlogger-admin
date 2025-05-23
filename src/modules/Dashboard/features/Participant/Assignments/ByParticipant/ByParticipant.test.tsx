import { PreloadedState } from '@reduxjs/toolkit';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mockedAppletData,
  mockedAppletId,
  mockedFullParticipant1,
  mockedLimitedParticipant,
  mockedOwnerId,
  mockedOwnerManager,
  mockedOwnerParticipant,
  mockedOwnerSubject,
  mockedOwnerSubjectWithDataAccess,
  mockParticipantActivities,
  mockParticipantFlows,
} from 'shared/mock';
import { page } from 'resources';
import { RootState } from 'redux/store';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import {
  mockGetRequestResponses,
  mockSchema,
  mockSuccessfulHttpResponse,
} from 'shared/utils/axios-mocks';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { Roles } from 'shared/consts';

import ByParticipant from './ByParticipant';

/* Mocks
=================================================== */

const successfulGetAppletActivitiesMock = mockSuccessfulHttpResponse({
  result: {
    activitiesDetails: mockedAppletData.activities,
    appletDetail: mockedAppletData,
  },
});

const mockActivitiesOrFlowsMetadata = [
  {
    activityOrFlowId: mockParticipantFlows.autoAssignFlow.id,
    respondentsCount: 1,
    respondentSubmissionsCount: 1,
    respondentLastSubmissionDate: '2025-01-01T00:00:00.000Z',
    subjectsCount: 1,
    subjectSubmissionsCount: 1,
    subjectLastSubmissionDate: '2025-01-01T00:00:00.000Z',
  },
  {
    activityOrFlowId: mockParticipantActivities.autoAssignActivity.id,
    respondentsCount: 1,
    respondentSubmissionsCount: 1,
    respondentLastSubmissionDate: '2025-01-01T00:00:00.000Z',
    subjectsCount: 1,
    subjectSubmissionsCount: 1,
    subjectLastSubmissionDate: '2025-01-01T00:00:00.000Z',
  },
  {
    activityOrFlowId: mockParticipantActivities.inactiveActivity.id,
    respondentsCount: 0,
    respondentSubmissionsCount: 1,
    respondentLastSubmissionDate: '2025-01-01T00:00:00.000Z',
    subjectsCount: 0,
    subjectSubmissionsCount: 1,
    subjectLastSubmissionDate: '2025-01-01T00:00:00.000Z',
  },
  {
    activityOrFlowId: mockParticipantActivities.hiddenActivity.id,
    respondentsCount: 1,
    respondentSubmissionsCount: 1,
    respondentLastSubmissionDate: '2025-01-01T00:00:00.000Z',
    subjectsCount: 1,
    subjectSubmissionsCount: 1,
    subjectLastSubmissionDate: '2025-01-01T00:00:00.000Z',
  },
];

const successfulGetAppletActivitiesMetadataMock = mockSuccessfulHttpResponse({
  result: {
    subjectId: mockedOwnerSubject.id,
    targetActivitiesCountExisting: 4,
    targetActivitiesCountDeleted: 0,
    respondentActivitiesCountExisting: 4,
    respondentActivitiesCountDeleted: 0,
    activitiesOrFlows: mockActivitiesOrFlowsMetadata,
  },
});

const successfulEmptyGetAppletRespondentSubjectActivitiesMock = mockSuccessfulHttpResponse({
  result: [],
  count: 0,
});

const mockParticipantActivitiesOrFlows = [
  mockParticipantFlows.autoAssignFlow,
  mockParticipantActivities.autoAssignActivity,
  mockParticipantActivities.inactiveActivity,
  mockParticipantActivities.hiddenActivity,
];

const successfulGetAppletRespondentSubjectActivitiesMock = mockSuccessfulHttpResponse({
  result: mockParticipantActivitiesOrFlows,
  count: 4,
});

const successfulGetTargetSubjectsByRespondentMock = ({
  activityOrFlowId,
  teamMemberCanViewData,
}: Partial<{
  activityOrFlowId: string;
  teamMemberCanViewData: boolean;
}>) => {
  const participantActivityOrFlow = mockParticipantActivitiesOrFlows.find(
    (a) => a.id === activityOrFlowId,
  );
  const activityOrFlowMetadata = mockActivitiesOrFlowsMetadata.find(
    (a) => a.activityOrFlowId === activityOrFlowId,
  );

  return mockSuccessfulHttpResponse({
    result: [
      {
        ...mockedOwnerSubject,
        submissionCount: activityOrFlowMetadata?.respondentSubmissionsCount,
        currentlyAssigned: participantActivityOrFlow?.status === 'active',
        teamMemberCanViewData: teamMemberCanViewData ?? true,
      },
    ],
    count: 1,
  });
};
const successfulGetAppletMock = mockSuccessfulHttpResponse({
  result: mockedAppletData,
});

const successfulGetWorkspaceRespondentsMock = ({ userId }: Record<string, string>) => {
  const respondents = [mockedOwnerParticipant, mockedFullParticipant1, mockedLimitedParticipant];
  const filteredRespondents = userId ? respondents.filter((r) => r.id === userId) : respondents;

  return mockSuccessfulHttpResponse({
    result: filteredRespondents,
    count: filteredRespondents.length,
  });
};

const successfulGetWorkspaceManagersMock = mockSuccessfulHttpResponse({
  result: [mockedOwnerManager],
  count: 1,
});

const GET_APPLET_URL = `/applets/${mockedAppletId}`;
const GET_APPLET_ACTIVITIES_URL = `/activities/applet/${mockedAppletId}`;
const GET_APPLET_ACTIVITIES_METADATA_URL = `/activities/applet/${mockedAppletId}/subject/${mockedOwnerSubject.id}/metadata`;
const GET_APPLET_RESPONDENT_SUBJECT_ACTIVITIES_URL = `/activities/applet/${mockedAppletId}/respondent/${mockedOwnerSubject.id}`;
const GET_TARGET_SUBJECTS_BY_RESPONDENT_URL = `/subjects/respondent/${mockedOwnerSubject.id}/activity-or-flow`;
const GET_WORKSPACE_RESPONDENTS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`;
const GET_WORKSPACE_MANAGERS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`;

const testId = 'participant-details-by-participant';
const route = `/dashboard/${mockedAppletId}/participants/${mockedOwnerSubject.id}`;
const routePath = page.appletParticipantDetails;

const preloadedState: (role?: Roles) => PreloadedState<RootState> = (role) => ({
  ...getPreloadedState(role),
  users: {
    respondentDetails: mockSchema(null),
    subjectDetails: mockSchema({
      result: mockedOwnerSubjectWithDataAccess,
    }),
  },
});

const renderOptions = {
  preloadedState: preloadedState(),
  route,
  routePath,
};

const getRequestResponses = {
  [GET_APPLET_URL]: successfulGetAppletMock,
  [GET_APPLET_ACTIVITIES_URL]: successfulGetAppletActivitiesMock,
  [GET_APPLET_ACTIVITIES_METADATA_URL]: successfulGetAppletActivitiesMetadataMock,
  [GET_APPLET_RESPONDENT_SUBJECT_ACTIVITIES_URL]:
    successfulGetAppletRespondentSubjectActivitiesMock,
  [`${GET_TARGET_SUBJECTS_BY_RESPONDENT_URL}/${mockParticipantActivitiesOrFlows[0].id}`]:
    successfulGetTargetSubjectsByRespondentMock({
      activityOrFlowId: mockParticipantActivitiesOrFlows[0].id,
    }),
  [GET_WORKSPACE_RESPONDENTS_URL]: successfulGetWorkspaceRespondentsMock,
  [GET_WORKSPACE_MANAGERS_URL]: successfulGetWorkspaceManagersMock,
};

vi.mock('shared/hooks/useFeatureFlags');

const mockUseFeatureFlags = vi.mocked(useFeatureFlags);

/* Tests
=================================================== */

describe('Dashboard > Applet > Participant > Assignments > By Participant screen', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParticipantMultiInformant: true,
        enableActivityAssign: true,
      },
      resetLDContext: vi.fn(),
    });

    mockGetRequestResponses(getRequestResponses);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the loading state at first', async () => {
    renderWithProviders(<ByParticipant />, renderOptions);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render the empty state', async () => {
    mockGetRequestResponses({
      ...getRequestResponses,
      [GET_APPLET_RESPONDENT_SUBJECT_ACTIVITIES_URL]:
        successfulEmptyGetAppletRespondentSubjectActivitiesMock,
    });

    renderWithProviders(<ByParticipant />, renderOptions);

    const emptyState = await screen.findByTestId(`${testId}-empty-state`);

    expect(emptyState).toBeInTheDocument();
  });

  it('should show counts in the tab bar', async () => {
    renderWithProviders(<ByParticipant />, renderOptions);

    await screen.findAllByTestId(`${testId}-activity-list-item`);

    expect(screen.getByText('About Participant •').children[0]?.textContent).toBe('4');
    expect(screen.getByText('By Participant •').children[0]?.textContent).toBe('4');
  });

  it('should render the list of activities and flows with metadata', async () => {
    renderWithProviders(<ByParticipant />, renderOptions);

    const activitiesOrFlows = await screen.findAllByTestId(`${testId}-activity-list-item`);
    expect(activitiesOrFlows).toHaveLength(4);

    expect(within(activitiesOrFlows[0]).getByText('Existing Activity Flow')).toBeInTheDocument();
    expect(within(activitiesOrFlows[0]).getByText('Flow')).toBeInTheDocument();
    expect(within(activitiesOrFlows[0]).getByText('Active')).toBeInTheDocument();
    expect(within(activitiesOrFlows[0]).getByText('Subjects').nextSibling?.textContent).toBe('1');
    expect(within(activitiesOrFlows[0]).getByText('Submissions').nextSibling?.textContent).toBe(
      '1',
    );

    expect(within(activitiesOrFlows[1]).getByText('Existing Activity')).toBeInTheDocument();
    expect(within(activitiesOrFlows[1]).queryByText('Flow')).toBeNull();
    expect(within(activitiesOrFlows[1]).getByText('Active')).toBeInTheDocument();
    expect(within(activitiesOrFlows[1]).getByText('Subjects').nextSibling?.textContent).toBe('1');
    expect(within(activitiesOrFlows[1]).getByText('Submissions').nextSibling?.textContent).toBe(
      '1',
    );

    expect(within(activitiesOrFlows[2]).getByText('Inactive Activity')).toBeInTheDocument();
    expect(within(activitiesOrFlows[2]).queryByText('Flow')).toBeNull();
    expect(within(activitiesOrFlows[2]).getByText('Inactive')).toBeInTheDocument();
    expect(within(activitiesOrFlows[2]).getByText('Subjects').nextSibling?.textContent).toBe('0');
    expect(within(activitiesOrFlows[2]).getByText('Submissions').nextSibling?.textContent).toBe(
      '1',
    );

    expect(within(activitiesOrFlows[3]).getByText('Hidden Activity')).toBeInTheDocument();
    expect(within(activitiesOrFlows[3]).queryByText('Flow')).toBeNull();
    expect(within(activitiesOrFlows[3]).getByText('Hidden')).toBeInTheDocument();
    expect(within(activitiesOrFlows[3]).getByText('Subjects').nextSibling?.textContent).toBe('1');
    expect(within(activitiesOrFlows[3]).getByText('Submissions').nextSibling?.textContent).toBe(
      '1',
    );
  });

  describe('expanded view', () => {
    it('should be expanded when clicking activity/flow card', async () => {
      renderWithProviders(<ByParticipant />, renderOptions);

      const activityOrFlow = (await screen.findAllByTestId(`${testId}-activity-list-item`))[0];

      const toggleButton = within(activityOrFlow).getByLabelText('Toggle Subjects View');

      await userEvent.click(toggleButton);

      const expandedView = within(activityOrFlow).getByTestId(`${testId}-0-expanded-view`);
      expect(expandedView).toBeVisible();

      expect(
        within(activityOrFlow).getByTestId(`${testId}-0-expanded-view-0-cell-id`),
      ).toHaveTextContent(`${mockedOwnerSubject.firstName} ${mockedOwnerSubject.lastName}`);
      expect(
        within(activityOrFlow).getByTestId(`${testId}-0-expanded-view-0-cell-submissionCount`),
      ).toHaveTextContent('1');
      expect(
        within(activityOrFlow).getByTestId(`${testId}-0-expanded-view-0-cell-currentlyAssigned`),
      ).toHaveTextContent('Yes');
    });

    it('should show Applet unlock popup when clicking View Data', async () => {
      renderWithProviders(<ByParticipant />, renderOptions);

      const activityOrFlow = (await screen.findAllByTestId(`${testId}-activity-list-item`))[0];

      const toggleButton = within(activityOrFlow).getByLabelText('Toggle Subjects View');

      await userEvent.click(toggleButton);

      const viewDataButton = screen.getByTestId(`${testId}-0-expanded-view-subject-0-view-data`);
      await userEvent.click(viewDataButton);

      expect(screen.getByTestId('unlock-applet-data-popup')).toBeVisible();
    });

    it('should default the View Data button to enabled', async () => {
      mockGetRequestResponses({
        ...getRequestResponses,
        [`${GET_TARGET_SUBJECTS_BY_RESPONDENT_URL}/${mockParticipantActivitiesOrFlows[0].id}`]:
          successfulGetTargetSubjectsByRespondentMock({
            activityOrFlowId: mockParticipantActivitiesOrFlows[0].id,
            teamMemberCanViewData: undefined,
          }),
      });

      renderWithProviders(<ByParticipant />, renderOptions);

      const activityOrFlow = (await screen.findAllByTestId(`${testId}-activity-list-item`))[0];

      const toggleButton = within(activityOrFlow).getByLabelText('Toggle Subjects View');

      await userEvent.click(toggleButton);

      const viewDataButton = screen.getByTestId(`${testId}-0-expanded-view-subject-0-view-data`);
      expect(viewDataButton).toBeEnabled();
    });

    it('should disable the View Data button according to the API data', async () => {
      mockGetRequestResponses({
        ...getRequestResponses,
        [`${GET_TARGET_SUBJECTS_BY_RESPONDENT_URL}/${mockParticipantActivitiesOrFlows[0].id}`]:
          successfulGetTargetSubjectsByRespondentMock({
            activityOrFlowId: mockParticipantActivitiesOrFlows[0].id,
            teamMemberCanViewData: false,
          }),
      });

      renderWithProviders(<ByParticipant />, renderOptions);

      const activityOrFlow = (await screen.findAllByTestId(`${testId}-activity-list-item`))[0];

      const toggleButton = within(activityOrFlow).getByLabelText('Toggle Subjects View');

      await userEvent.click(toggleButton);

      const viewDataButton = screen.getByTestId(`${testId}-0-expanded-view-subject-0-view-data`);
      expect(viewDataButton).toBeDisabled();
    });

    it('should default the export data menu item to enabled when visible', async () => {
      mockGetRequestResponses({
        ...getRequestResponses,
        [`${GET_TARGET_SUBJECTS_BY_RESPONDENT_URL}/${mockParticipantActivitiesOrFlows[0].id}`]:
          successfulGetTargetSubjectsByRespondentMock({
            activityOrFlowId: mockParticipantActivitiesOrFlows[0].id,
            teamMemberCanViewData: undefined,
          }),
      });

      renderWithProviders(<ByParticipant />, renderOptions);

      const activityOrFlow = (await screen.findAllByTestId(`${testId}-activity-list-item`))[0];

      const toggleButton = within(activityOrFlow).getByLabelText('Toggle Subjects View');

      await userEvent.click(toggleButton);

      const actionsMenuButton = screen.getByTestId(`${testId}-0-expanded-view-subject-0-dots`);
      await userEvent.click(actionsMenuButton);

      const exportDataMenuItem = screen.getByTestId(`${testId}-export`);

      expect(exportDataMenuItem).toBeEnabled();
    });

    it('should disable the export data menu item according to API data', async () => {
      mockGetRequestResponses({
        ...getRequestResponses,
        [`${GET_TARGET_SUBJECTS_BY_RESPONDENT_URL}/${mockParticipantActivitiesOrFlows[0].id}`]:
          successfulGetTargetSubjectsByRespondentMock({
            activityOrFlowId: mockParticipantActivitiesOrFlows[0].id,
            teamMemberCanViewData: false,
          }),
      });

      renderWithProviders(<ByParticipant />, renderOptions);

      const activityOrFlow = (await screen.findAllByTestId(`${testId}-activity-list-item`))[0];

      const toggleButton = within(activityOrFlow).getByLabelText('Toggle Subjects View');

      await userEvent.click(toggleButton);

      const actionsMenuButton = screen.getByTestId(`${testId}-0-expanded-view-subject-0-dots`);
      await userEvent.click(actionsMenuButton);

      const exportDataMenuItem = screen.getByTestId(`${testId}-export`);

      expect(exportDataMenuItem).toBeEnabled();
    });
  });
});
