import { PreloadedState } from '@reduxjs/toolkit';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mockedAppletData,
  mockedAppletId,
  mockedFullParticipant1,
  mockedFullParticipant1Detail,
  mockedLimitedParticipant,
  mockedLimitedParticipantDetail,
  mockedOwnerId,
  mockedOwnerManager,
  mockedOwnerParticipant,
  mockedOwnerParticipantDetail,
  mockedOwnerSubject,
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
import { ParticipantWithDataAccess } from 'modules/Dashboard/types';

import AboutParticipant from './AboutParticipant';

/* Mocks
=================================================== */

const successfulGetAppletActivitiesMock = mockSuccessfulHttpResponse({
  result: {
    activitiesDetails: mockedAppletData.activities,
    appletDetail: mockedAppletData,
  },
});

const mockActivitiesOrFlows = [
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
    activitiesOrFlows: mockActivitiesOrFlows,
  },
});

const successfulEmptyGetAppletTargetSubjectActivitiesMock = mockSuccessfulHttpResponse({
  result: [],
  count: 0,
});

const successfulGetAppletTargetSubjectActivitiesMock = mockSuccessfulHttpResponse({
  result: [
    mockParticipantFlows.autoAssignFlow,
    mockParticipantActivities.autoAssignActivity,
    mockParticipantActivities.inactiveActivity,
    mockParticipantActivities.hiddenActivity,
  ],
  count: 4,
});

const successfulGetAppletMock = mockSuccessfulHttpResponse({
  result: mockedAppletData,
});

const successfulGetWorkspaceRespondentsMock = ({ userId }: Record<string, string>) => {
  const respondents: ParticipantWithDataAccess[] = [
    {
      ...mockedOwnerParticipant,
      details: [{ ...mockedOwnerParticipantDetail, teamMemberCanViewData: true }],
    },
    {
      ...mockedFullParticipant1,
      details: [{ ...mockedFullParticipant1Detail, teamMemberCanViewData: true }],
    },
    {
      ...mockedLimitedParticipant,
      details: [{ ...mockedLimitedParticipantDetail, teamMemberCanViewData: true }],
    },
  ];
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
const GET_APPLET_TARGET_SUBJECT_ACTIVITIES_URL = `/activities/applet/${mockedAppletId}/target/${mockedOwnerSubject.id}`;
const GET_WORKSPACE_RESPONDENTS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`;
const GET_WORKSPACE_MANAGERS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`;

const testId = 'participant-details-about-participant';
const route = `/dashboard/${mockedAppletId}/participants/${mockedOwnerSubject.id}`;
const routePath = page.appletParticipantDetails;

const preloadedState: (role?: Roles) => PreloadedState<RootState> = (role) => ({
  ...getPreloadedState(role),
  users: {
    respondentDetails: mockSchema(null),
    allRespondents: mockSchema(null, {
      status: 'idle',
    }),
    subjectDetails: mockSchema({
      result: {
        ...mockedOwnerSubject,
        teamMemberCanViewData: true,
      },
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
  [GET_APPLET_TARGET_SUBJECT_ACTIVITIES_URL]: successfulGetAppletTargetSubjectActivitiesMock,
  [GET_WORKSPACE_RESPONDENTS_URL]: successfulGetWorkspaceRespondentsMock,
  [GET_WORKSPACE_MANAGERS_URL]: successfulGetWorkspaceManagersMock,
};

jest.mock('shared/hooks/useFeatureFlags');

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

/* Tests
=================================================== */

describe('Dashboard > Applet > Participant > Assignments > About Participant screen', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParticipantMultiInformant: true,
        enableActivityAssign: true,
      },
      resetLDContext: jest.fn(),
    });

    mockGetRequestResponses(getRequestResponses);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the loading state at first', async () => {
    renderWithProviders(<AboutParticipant />, renderOptions);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render the empty state', async () => {
    mockGetRequestResponses({
      ...getRequestResponses,
      [GET_APPLET_TARGET_SUBJECT_ACTIVITIES_URL]:
        successfulEmptyGetAppletTargetSubjectActivitiesMock,
    });

    renderWithProviders(<AboutParticipant />, renderOptions);

    const emptyState = await screen.findByTestId(`${testId}-empty-state`);

    expect(emptyState).toBeInTheDocument();
  });

  it('should show counts in the tab bar', async () => {
    renderWithProviders(<AboutParticipant />, renderOptions);

    await screen.findAllByTestId(`${testId}-activity-list-item`);

    expect(screen.getByText('About Participant •').children[0]?.textContent).toBe('4');
    expect(screen.getByText('By Participant •').children[0]?.textContent).toBe('4');
  });

  it('should render the list of activities and flows with metadata', async () => {
    renderWithProviders(<AboutParticipant />, renderOptions);

    const activitiesOrFlows = await screen.findAllByTestId(`${testId}-activity-list-item`);

    expect(within(activitiesOrFlows[0]).getByText('Existing Activity Flow')).toBeInTheDocument();
    expect(within(activitiesOrFlows[0]).getByText('Flow')).toBeInTheDocument();
    expect(within(activitiesOrFlows[0]).getByText('Active')).toBeInTheDocument();
    expect(within(activitiesOrFlows[0]).getByText('Respondents').nextSibling?.textContent).toBe(
      '1',
    );
    expect(within(activitiesOrFlows[0]).getByText('Submissions').nextSibling?.textContent).toBe(
      '1',
    );

    expect(within(activitiesOrFlows[1]).getByText('Existing Activity')).toBeInTheDocument();
    expect(within(activitiesOrFlows[1]).queryByText('Flow')).toBeNull();
    expect(within(activitiesOrFlows[1]).getByText('Active')).toBeInTheDocument();
    expect(within(activitiesOrFlows[1]).getByText('Respondents').nextSibling?.textContent).toBe(
      '1',
    );
    expect(within(activitiesOrFlows[1]).getByText('Submissions').nextSibling?.textContent).toBe(
      '1',
    );

    expect(within(activitiesOrFlows[2]).getByText('Inactive Activity')).toBeInTheDocument();
    expect(within(activitiesOrFlows[2]).queryByText('Flow')).toBeNull();
    expect(within(activitiesOrFlows[2]).getByText('Inactive')).toBeInTheDocument();
    expect(within(activitiesOrFlows[2]).getByText('Respondents').nextSibling?.textContent).toBe(
      '0',
    );
    expect(within(activitiesOrFlows[2]).getByText('Submissions').nextSibling?.textContent).toBe(
      '1',
    );

    expect(within(activitiesOrFlows[3]).getByText('Hidden Activity')).toBeInTheDocument();
    expect(within(activitiesOrFlows[3]).queryByText('Flow')).toBeNull();
    expect(within(activitiesOrFlows[3]).getByText('Hidden')).toBeInTheDocument();
    expect(within(activitiesOrFlows[3]).getByText('Respondents').nextSibling?.textContent).toBe(
      '1',
    );
    expect(within(activitiesOrFlows[3]).getByText('Submissions').nextSibling?.textContent).toBe(
      '1',
    );
  });

  it('should show Applet unlock popup when clicking View Data', async () => {
    renderWithProviders(<AboutParticipant />, renderOptions);

    const activitiesOrFlows = await screen.findAllByTestId(`${testId}-activity-list-item`);

    await userEvent.click(within(activitiesOrFlows[0]).getByText('View Data'));

    expect(screen.getByTestId('unlock-applet-data-popup')).toBeVisible();
  });

  it('should disable the view data button according to API data', async () => {
    const localPreloadedState = preloadedState();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    localPreloadedState.users!.subjectDetails.data!.result.teamMemberCanViewData = false;

    renderWithProviders(<AboutParticipant />, {
      ...renderOptions,
      preloadedState: localPreloadedState,
    });

    const activitiesOrFlows = await screen.findAllByTestId(`${testId}-activity-list-item`);

    const viewDataButton = within(activitiesOrFlows[0]).getByText('View Data');

    expect(viewDataButton).toBeDisabled();
  });
});
