import {
  DEFAULT_IDLE_TIMEOUT_MIN,
  DEFAULT_REFRESH_LEAD_SEC,
  MS_IN_MIN,
  MS_IN_SEC,
} from './useSessionKeepAlive.const';
import { resolveSessionConfig } from './useSessionKeepAlive.utils';

const defaults = {
  idleTimeoutMs: DEFAULT_IDLE_TIMEOUT_MIN * MS_IN_MIN,
  refreshLeadMs: DEFAULT_REFRESH_LEAD_SEC * MS_IN_SEC,
};

describe('resolveSessionConfig', () => {
  test('falls back to defaults when nothing is configured', () => {
    expect(resolveSessionConfig({})).toEqual(defaults);
  });

  test('converts configured values to milliseconds', () => {
    expect(
      resolveSessionConfig({
        REACT_APP_IDLE_TIMEOUT_MIN: '15',
        REACT_APP_REFRESH_LEAD_SEC: '45',
      }),
    ).toEqual({ idleTimeoutMs: 900000, refreshLeadMs: 45000 });
  });

  test('accepts the short values used for testing', () => {
    expect(
      resolveSessionConfig({
        REACT_APP_IDLE_TIMEOUT_MIN: '1',
        REACT_APP_REFRESH_LEAD_SEC: '10',
      }),
    ).toEqual({ idleTimeoutMs: 60000, refreshLeadMs: 10000 });
  });

  test.each(['', '   ', 'abc', '0', '-5', 'Infinity'])(
    'falls back when the value is "%s"',
    (raw) => {
      expect(
        resolveSessionConfig({
          REACT_APP_IDLE_TIMEOUT_MIN: raw,
          REACT_APP_REFRESH_LEAD_SEC: raw,
        }),
      ).toEqual(defaults);
    },
  );

  test('resolves each variable independently', () => {
    expect(
      resolveSessionConfig({
        REACT_APP_IDLE_TIMEOUT_MIN: 'nonsense',
        REACT_APP_REFRESH_LEAD_SEC: '20',
      }),
    ).toEqual({ idleTimeoutMs: defaults.idleTimeoutMs, refreshLeadMs: 20000 });
  });
});
