import mockAxios from 'jest-mock-axios';
import { generatePath, useNavigate } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedApplet, mockedFullSubjectId1 } from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { page } from 'resources';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import ParticipantDetails from './ParticipantDetails';

const route = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}`;
const routePath = page.appletParticipantDetails;

const mockedAppletResult = {
  data: {
    result: mockedApplet,
  },
};

const mockedParticipantResult = {
  data: {
    result: {
      id: 'test',
      secretId: 'test-secret-id',
      displayName: 'testUser',
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
    mockAxios.get.mockResolvedValue(mockedAppletResult);
    mockAxios.get.mockResolvedValue(mockedParticipantResult);

    const { getByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route,
      routePath,
    });

    await waitFor(() => getByTestId('participant-activities'));
  });
  test('should render participant connections', async () => {
    mockAxios.get.mockResolvedValue(mockedAppletResult);
    mockAxios.get.mockResolvedValue(mockedParticipantResult);

    const { getByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route: `${route}/connections`,
      routePath: page.appletParticipantConnections,
    });

    await waitFor(() => getByTestId('participant-connections'));
  });
  test('should render participant schedules', async () => {
    mockAxios.get.mockResolvedValue(mockedAppletResult);
    mockAxios.get.mockResolvedValue(mockedParticipantResult);

    const { getByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route: `${route}/schedule`,
      routePath: page.appletParticipantSchedule,
    });

    await waitFor(() => getByTestId('participant-schedule'));
  });
  test('should not render participant connections if the feature flag is disabled', async () => {
    mockAxios.get.mockResolvedValue(mockedAppletResult);
    mockAxios.get.mockResolvedValue(mockedParticipantResult);
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
