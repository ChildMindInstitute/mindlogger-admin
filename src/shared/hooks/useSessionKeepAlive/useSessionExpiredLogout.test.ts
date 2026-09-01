import { waitFor } from '@testing-library/react';

import { setSessionExpiredHandler, refreshTokenAndReattemptRequest } from 'shared/api';
import { signInRefreshTokenApi } from 'shared/api/api';
import { useLogout } from 'shared/hooks/useLogout';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { state as authState } from 'modules/Auth/state/Auth.state';

import { useSessionExpiredLogout } from './useSessionExpiredLogout';

vi.mock('shared/hooks/useLogout', () => ({ useLogout: vi.fn() }));
vi.mock('shared/api/api', () => ({ signInRefreshTokenApi: vi.fn() }));

const mockedLogout = vi.fn();
const failedRequest = { response: { config: { url: '/applets' } } } as never;

const renderExpiredLogout = (isAuthorized = true) =>
  renderHookWithProviders(useSessionExpiredLogout, {
    preloadedState: { ...getPreloadedState(), auth: { ...authState, isAuthorized } },
  });

describe('useSessionExpiredLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setSessionExpiredHandler(null);
    vi.mocked(useLogout).mockReturnValue(mockedLogout);
    // What a revoked family looks like from here: the refresh call itself is rejected.
    vi.mocked(signInRefreshTokenApi).mockRejectedValue(new Error('revoked'));
  });

  test('ends the session when a refresh triggered by a request fails', async () => {
    renderExpiredLogout();

    await expect(refreshTokenAndReattemptRequest(failedRequest)).rejects.toThrow('revoked');

    await waitFor(() =>
      expect(mockedLogout).toHaveBeenCalledWith({
        shouldSoftLock: true,
        reason: 'refresh-failed',
      }),
    );
  });

  test('ends it once when several requests fail together', async () => {
    renderExpiredLogout();

    await Promise.allSettled([
      refreshTokenAndReattemptRequest(failedRequest),
      refreshTokenAndReattemptRequest(failedRequest),
      refreshTokenAndReattemptRequest(failedRequest),
    ]);

    await waitFor(() => expect(mockedLogout).toHaveBeenCalledTimes(1));
  });

  test('leaves a signed-out tab alone', async () => {
    renderExpiredLogout(false);

    await expect(refreshTokenAndReattemptRequest(failedRequest)).rejects.toThrow('revoked');

    expect(mockedLogout).not.toHaveBeenCalled();
  });
});
