import axios from 'axios';
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

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

jest.mock('shared/hooks/useFeatureFlags', () => ({
  ...jest.requireActual('shared/hooks/useFeatureFlags'),
  useFeatureFlags: vi.fn(),
}));

describe('Participant Details page', () => {
  const navigate: jest.Mock = vi.fn();

  beforeEach(() => {
    jest.mocked(useNavigate).mockImplementation(() => navigate);
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableParticipantConnections: true,
      },
      resetLDContext: vi.fn(),
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
    vi.mocked(axios.get).mockRejectedValue(null);
    vi.mocked(axios.get).mockRejectedValue(null);

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
    vi.mocked(axios.get).mockResolvedValue(mockedAppletResult);
    vi.mocked(axios.get).mockResolvedValue(mockedParticipantResult);

    const { getByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route,
      routePath,
    });

    await waitFor(() => getByTestId('participant-activities'));
  });
  test('should render participant connections', async () => {
    vi.mocked(axios.get).mockResolvedValue(mockedAppletResult);
    vi.mocked(axios.get).mockResolvedValue(mockedParticipantResult);

    const { getByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route: `${route}/connections`,
      routePath: page.appletParticipantConnections,
    });

    await waitFor(() => getByTestId('participant-connections'));
  });
  test('should render participant schedules', async () => {
    vi.mocked(axios.get).mockResolvedValue(mockedAppletResult);
    vi.mocked(axios.get).mockResolvedValue(mockedParticipantResult);

    const { getByTestId } = renderWithProviders(<ParticipantDetails />, {
      preloadedState: getPreloadedState(),
      route: `${route}/schedule`,
      routePath: page.appletParticipantSchedule,
    });

    await waitFor(() => getByTestId('participant-schedule'));
  });
  test('should not render participant connections if the feature flag is disabled', async () => {
    vi.mocked(axios.get).mockResolvedValue(mockedAppletResult);
    vi.mocked(axios.get).mockResolvedValue(mockedParticipantResult);
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableParticipantConnections: false,
      },
      resetLDContext: vi.fn(),
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
