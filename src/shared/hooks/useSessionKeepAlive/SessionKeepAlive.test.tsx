import { act, fireEvent, screen } from '@testing-library/react';

import { authStorage } from 'shared/utils';
import { useLogout } from 'shared/hooks/useLogout';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import {
  InMemoryBroadcastChannel,
  resetInMemoryBroadcastChannels,
} from 'shared/tests/InMemoryBroadcastChannel';
import { state as authState } from 'modules/Auth/state/Auth.state';

import { SessionKeepAlive } from './SessionKeepAlive';
import { clearSessionState } from './sessionStore';
import { closeSessionSync } from './sessionSync';
import { MS_IN_MIN, MS_IN_SEC } from './useSessionKeepAlive.const';

vi.mock('shared/api', () => ({ refreshTokens: vi.fn(), setSessionExpiredHandler: vi.fn() }));
vi.mock('shared/hooks/useLogout', () => ({ useLogout: vi.fn() }));
// Pinned so the suite does not depend on the .env a developer happens to have locally.
vi.mock('./useSessionKeepAlive.utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./useSessionKeepAlive.utils')>()),
  resolveSessionConfig: () => ({
    idleTimeoutMs: 30 * 60 * 1000,
    refreshLeadMs: 90 * 1000,
    warningLeadMs: 5 * 60 * 1000,
  }),
}));

const mockedLogout = vi.fn();

const IDLE_TIMEOUT_MS = 30 * MS_IN_MIN;
const WARNING_LEAD_MS = 5 * MS_IN_MIN;

const tokenExpiringIn = (ms: number) =>
  `header.${btoa(JSON.stringify({ exp: Math.floor((Date.now() + ms) / 1000) }))}.signature`;

const renderKeepAlive = () =>
  renderWithProviders(<SessionKeepAlive />, {
    preloadedState: { ...getPreloadedState(), auth: { ...authState, isAuthorized: true } },
  });

// Long enough for the warning to be due, but not for the session to have ended.
const idleUntilTheWarning = () =>
  act(() => {
    vi.advanceTimersByTime(IDLE_TIMEOUT_MS - WARNING_LEAD_MS);
  });

const warning = () => screen.queryByTestId('session-timeout-modal');

describe('SessionKeepAlive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'));
    localStorage.clear();

    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    vi.mocked(useLogout).mockReturnValue(mockedLogout);
    authStorage.setAccessToken(tokenExpiringIn(15 * MS_IN_MIN));
    authStorage.setRefreshToken(`header.${btoa(JSON.stringify({ family: 'family-1' }))}.signature`);
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    clearSessionState();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('shows nothing while the deadline is far off', () => {
    renderKeepAlive();

    expect(warning()).not.toBeInTheDocument();
  });

  test('shows the countdown once the warning is due', () => {
    renderKeepAlive();

    idleUntilTheWarning();

    expect(warning()).toBeInTheDocument();
    expect(screen.getByText(/we'll log you out in 5:00\./)).toBeInTheDocument();
  });

  test('redraws the countdown every second', () => {
    renderKeepAlive();

    idleUntilTheWarning();
    act(() => {
      vi.advanceTimersByTime(3 * MS_IN_SEC);
    });

    expect(screen.getByText(/we'll log you out in 4:57\./)).toBeInTheDocument();
  });

  test('staying logged in dismisses it and keeps the session', () => {
    renderKeepAlive();

    idleUntilTheWarning();
    act(() => {
      fireEvent.click(screen.getByTestId('session-timeout-modal-submit-button'));
    });

    expect(warning()).not.toBeInTheDocument();
    expect(mockedLogout).not.toHaveBeenCalled();
  });

  test('logging out from the warning ends the session without a soft lock', () => {
    renderKeepAlive();

    idleUntilTheWarning();
    act(() => {
      fireEvent.click(screen.getByTestId('session-timeout-modal-secondary-button'));
    });

    expect(mockedLogout).toHaveBeenCalledWith({
      shouldSoftLock: false,
      reason: 'manual',
      isRemote: false,
    });
  });

  test('an unanswered countdown runs out into a soft locked logout', () => {
    renderKeepAlive();

    act(() => {
      vi.advanceTimersByTime(IDLE_TIMEOUT_MS);
    });

    expect(warning()).not.toBeInTheDocument();
    expect(mockedLogout).toHaveBeenCalledWith({
      shouldSoftLock: true,
      reason: 'idle',
      isRemote: false,
    });
  });
});
