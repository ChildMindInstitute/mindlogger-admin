import {
  DEFAULT_IDLE_TIMEOUT_MIN,
  DEFAULT_IDLE_WARNING_MIN,
  DEFAULT_REFRESH_LEAD_SEC,
  MS_IN_MIN,
  MS_IN_SEC,
} from './useSessionKeepAlive.const';
import { SessionConfig } from './useSessionKeepAlive.types';

// A non-positive value would put every deadline in the past.
const positiveOrDefault = (raw: string | undefined, fallback: number) => {
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const resolveSessionConfig = (
  env: Partial<ImportMetaEnv> = import.meta.env,
): SessionConfig => {
  const idleTimeoutMs =
    positiveOrDefault(env.REACT_APP_IDLE_TIMEOUT_MIN, DEFAULT_IDLE_TIMEOUT_MIN) * MS_IN_MIN;

  return {
    idleTimeoutMs,
    refreshLeadMs:
      positiveOrDefault(env.REACT_APP_REFRESH_LEAD_SEC, DEFAULT_REFRESH_LEAD_SEC) * MS_IN_SEC,
    // Capped at half: a lead longer than the timeout would open the warning from the start.
    warningLeadMs: Math.min(
      positiveOrDefault(env.REACT_APP_IDLE_WARNING_MIN, DEFAULT_IDLE_WARNING_MIN) * MS_IN_MIN,
      idleTimeoutMs / 2,
    ),
  };
};

// Rounds up, so the last second reads 0:01 rather than 0:00 with time still on the clock.
export const formatCountdown = (ms: number) => {
  const totalSeconds = Math.max(Math.ceil(ms / MS_IN_SEC), 0);

  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
};
