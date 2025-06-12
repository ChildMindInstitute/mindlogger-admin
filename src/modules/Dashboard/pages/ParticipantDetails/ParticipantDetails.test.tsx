import mockAxios from 'jest-mock-axios';
import { generatePath, useNavigate } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedAppletId,
  mockedApplet,
  mockedFullSubjectId1,
  mockedAppletData,
  mockedFullParticipant1,
} from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { page } from 'resources';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { ApiResponseCodes } from 'api';
import { mockGetRequestResponses } from 'shared/utils/axios-mocks';

import ParticipantDetails from './ParticipantDetails';

const route = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}`;
const routePath = page.appletParticipantDetails;

export const GET_APPLET_URL = `/applets/${mockedAppletId}`;
export const GET_SUBJECT_DETAILS_URL = `/subjects/${mockedFullSubjectId1}`;
export const GET_APPLET_ACTIVITIES_URL = `/activities/applet/${mockedAppletId}`;

const mockedAppletResult = {
  data: {
    result: mockedApplet,
  },
};

const mockedSubjectResult = {
  data: {
    result: mockedFullParticipant1,
  },
};

const mockedGetAppletActivities = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: mockedAppletData.activities,
      appletDetail: mockedAppletData,
    },
  },
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  ...jest.requireActual('shared/hooks/useFeatureFlags'),
  useFeatureFlags: jest.fn(),
}));

describe('Participant Details page', () => {
  const navigate: jest.Mock = jest.fn();

  beforeEach(() => {
    mockGetRequestResponses({
      [GET_APPLET_URL]: mockedAppletResult,
      [GET_SUBJECT_DETAILS_URL]: mockedSubjectResult,
      [GET_APPLET_ACTIVITIES_URL]: mockedGetAppletActivities,
    });

    jest.mocked(useNavigate).mockImplementation(() => navigate);
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableParticipantConnections: true,
      },
      resetLDContext: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should display a loading indicator while both applet and participant data is loading', async () => {
    renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route,
      routePath,
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('should redirect to activity participants if participantId does not exists', async () => {
    mockAxios.get.mockRejectedValue(null);
    mockAxios.get.mockRejectedValue(null);

    renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route,
      routePath,
    });

    await waitFor(() => screen.getByTestId('spinner'));

    expect(navigate).toHaveBeenCalledWith(
      generatePath(page.appletParticipants, {
        appletId: mockedAppletId,
      }),
    );
  });

  test('should render participant activities', async () => {
    const { getByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route,
      routePath,
    });

    await waitFor(() => getByTestId('participant-activities'));
  });
  test('should render participant connections', async () => {
    const { getByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route: `${route}/connections`,
      routePath: page.appletParticipantConnections,
    });

    await waitFor(() => getByTestId('participant-connections'));
  });
  test('should render participant schedules', async () => {
    const { getByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route: `${route}/schedule`,
      routePath: page.appletParticipantSchedule,
    });

    await waitFor(() => getByTestId('participant-schedule'));
  });
  test('should not render participant connections if the feature flag is disabled', async () => {
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableParticipantConnections: false,
      },
      resetLDContext: jest.fn(),
    });

    const { queryByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route: `${route}/connections`,
      routePath: page.appletParticipantConnections,
    });

    const connections = queryByTestId('participant-connections');
    expect(connections).toBeNull();
  });
});
