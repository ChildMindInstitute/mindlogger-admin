import { PreloadedState } from '@reduxjs/toolkit';
import { screen } from '@testing-library/react';

import {
  mockedAppletData,
  mockedAppletId,
  mockedFullParticipant1,
  mockedLimitedParticipant,
  mockedOwnerId,
  mockedOwnerManager,
  mockedOwnerParticipant,
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

import AboutParticipant from './AboutParticipant';

/* Mocks
=================================================== */

const successfulGetAppletActivitiesMock = mockSuccessfulHttpResponse({
  result: {
    activitiesDetails: mockedAppletData.activities,
    appletDetail: mockedAppletData,
  },
});

const successfulGetAppletActivitiesMetadataMock = mockSuccessfulHttpResponse({
  result: {
    subjectId: mockedOwnerSubject.id,
    targetActivitiesCountExisting: 2,
    targetActivitiesCountDeleted: 0,
    respondentActivitiesCountExisting: 2,
    respondentActivitiesCountDeleted: 0,
    activitiesOrFlows: [
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
    ],
  },
});

const successfulEmptyGetAppletTargetSubjectActivitiesMock = mockSuccessfulHttpResponse({
  result: [],
  count: 0,
});

const successfulGetAppletTargetSubjectActivitiesMock = mockSuccessfulHttpResponse({
  result: [mockParticipantFlows.autoAssignFlow, mockParticipantActivities.autoAssignActivity],
  count: 2,
});

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
const GET_APPLET_TARGET_SUBJECT_ACTIVITIES_URL = `/activities/applet/${mockedAppletId}/target/${mockedOwnerSubject.id}`;
const GET_WORKSPACE_RESPONDENTS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`;
const GET_WORKSPACE_MANAGERS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`;

const testId = 'participant-details-about-participant';
const route = `/dashboard/${mockedAppletId}/participants/${mockedOwnerSubject.id}`;
const routePath = page.appletParticipantDetails;

const preloadedState: PreloadedState<RootState> = {
  ...getPreloadedState(),
  users: {
    respondentDetails: mockSchema(null),
    allRespondents: mockSchema(null, {
      status: 'idle',
    }),
    subjectDetails: mockSchema({
      result: mockedOwnerSubject,
    }),
  },
};

const renderOptions = {
  preloadedState,
  route,
  routePath,
};

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

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

    mockGetRequestResponses({
      [GET_APPLET_URL]: successfulGetAppletMock,
      [GET_APPLET_ACTIVITIES_URL]: successfulGetAppletActivitiesMock,
      [GET_APPLET_ACTIVITIES_METADATA_URL]: successfulGetAppletActivitiesMetadataMock,
      [GET_APPLET_TARGET_SUBJECT_ACTIVITIES_URL]: successfulGetAppletTargetSubjectActivitiesMock,
      [GET_WORKSPACE_RESPONDENTS_URL]: successfulGetWorkspaceRespondentsMock,
      [GET_WORKSPACE_MANAGERS_URL]: successfulGetWorkspaceManagersMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the loading state', async () => {
    renderWithProviders(<AboutParticipant />, renderOptions);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render the empty state', async () => {
    mockGetRequestResponses({
      [GET_APPLET_URL]: successfulGetAppletMock,
      [GET_APPLET_ACTIVITIES_URL]: successfulGetAppletActivitiesMock,
      [GET_APPLET_ACTIVITIES_METADATA_URL]: successfulGetAppletActivitiesMetadataMock,
      [GET_APPLET_TARGET_SUBJECT_ACTIVITIES_URL]:
        successfulEmptyGetAppletTargetSubjectActivitiesMock,
      [GET_WORKSPACE_RESPONDENTS_URL]: successfulGetWorkspaceRespondentsMock,
      [GET_WORKSPACE_MANAGERS_URL]: successfulGetWorkspaceManagersMock,
    });

    renderWithProviders(<AboutParticipant />, renderOptions);

    const emptyState = await screen.findByTestId(`${testId}-empty-state`);

    expect(emptyState).toBeInTheDocument();
  });
});
