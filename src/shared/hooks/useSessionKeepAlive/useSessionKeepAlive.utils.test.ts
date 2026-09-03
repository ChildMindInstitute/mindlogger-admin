import {
  DEFAULT_IDLE_TIMEOUT_MIN,
  DEFAULT_IDLE_WARNING_MIN,
  DEFAULT_REFRESH_LEAD_SEC,
  MS_IN_MIN,
  MS_IN_SEC,
} from './useSessionKeepAlive.const';
import { formatCountdown, resolveSessionConfig } from './useSessionKeepAlive.utils';

const defaults = {
  idleTimeoutMs: DEFAULT_IDLE_TIMEOUT_MIN * MS_IN_MIN,
  refreshLeadMs: DEFAULT_REFRESH_LEAD_SEC * MS_IN_SEC,
  warningLeadMs: DEFAULT_IDLE_WARNING_MIN * MS_IN_MIN,
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
        REACT_APP_IDLE_WARNING_MIN: '2',
      }),
    ).toEqual({ idleTimeoutMs: 900000, refreshLeadMs: 45000, warningLeadMs: 120000 });
  });

  test('accepts the short values used for testing', () => {
    expect(
      resolveSessionConfig({
        REACT_APP_IDLE_TIMEOUT_MIN: '3',
        REACT_APP_REFRESH_LEAD_SEC: '10',
        REACT_APP_IDLE_WARNING_MIN: '1',
      }),
    ).toEqual({ idleTimeoutMs: 180000, refreshLeadMs: 10000, warningLeadMs: 60000 });
  });

  test.each(['', '   ', 'abc', '0', '-5', 'Infinity'])(
    'falls back when the value is "%s"',
    (raw) => {
      expect(
        resolveSessionConfig({
          REACT_APP_IDLE_TIMEOUT_MIN: raw,
          REACT_APP_REFRESH_LEAD_SEC: raw,
          REACT_APP_IDLE_WARNING_MIN: raw,
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
    ).toEqual({ ...defaults, refreshLeadMs: 20000 });
  });

  // The default 5 minute lead against a timeout QA shortened to 3, which without the cap would
  // open the warning at once and leave it open, freezing the activity it pauses.
  test('caps the warning at half the idle timeout', () => {
    expect(resolveSessionConfig({ REACT_APP_IDLE_TIMEOUT_MIN: '3' }).warningLeadMs).toBe(90000);
  });

  test('leaves a warning shorter than half the timeout alone', () => {
    expect(
      resolveSessionConfig({
        REACT_APP_IDLE_TIMEOUT_MIN: '30',
        REACT_APP_IDLE_WARNING_MIN: '5',
      }).warningLeadMs,
    ).toBe(300000);
  });
});

describe('formatCountdown', () => {
  test.each([
    [300000, '5:00'],
    [90000, '1:30'],
    [60000, '1:00'],
    [7000, '0:07'],
    [0, '0:00'],
  ])('renders %i ms as %s', (ms, expected) => {
    expect(formatCountdown(ms)).toBe(expected);
  });

  // A tick landing a hair late must not read 0:00 while the session is still alive.
  test('rounds a part second up', () => {
    expect(formatCountdown(6001)).toBe('0:07');
    expect(formatCountdown(1)).toBe('0:01');
  });

  test('never renders a negative countdown', () => {
    expect(formatCountdown(-5000)).toBe('0:00');
  });
});
