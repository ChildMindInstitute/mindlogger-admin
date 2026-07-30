import {
  DEFAULT_IDLE_TIMEOUT_MIN,
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
): SessionConfig => ({
  idleTimeoutMs:
    positiveOrDefault(env.REACT_APP_IDLE_TIMEOUT_MIN, DEFAULT_IDLE_TIMEOUT_MIN) * MS_IN_MIN,
  refreshLeadMs:
    positiveOrDefault(env.REACT_APP_REFRESH_LEAD_SEC, DEFAULT_REFRESH_LEAD_SEC) * MS_IN_SEC,
});
