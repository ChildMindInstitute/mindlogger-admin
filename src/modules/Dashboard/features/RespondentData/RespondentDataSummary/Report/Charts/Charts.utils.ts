import { MAX_LABEL_CHARS_Y, MS_PER_DAY, MS_PER_HOUR } from './Charts.const';

export const truncateString = (label: string) =>
  label?.length > MAX_LABEL_CHARS_Y ? `${label.substring(0, MAX_LABEL_CHARS_Y)}...` : label;

export const getTimeConfig = (minMs: number, maxMs: number) => {
  const days = (maxMs - minMs) / MS_PER_DAY;
  if (days > 2) {
    return {
      type: 'time' as const,
      time: {
        unit: 'day' as const,
        displayFormats: {
          month: 'MMM d' as const,
        },
      },
    };
  }

  const hours = (maxMs - minMs) / MS_PER_HOUR;
  if (hours > 3) {
    return {
      type: 'time' as const,
      time: {
        unit: 'hour' as const,
        displayFormats: {
          hour: 'H:mm' as const,
        },
      },
    };
  }

  return {
    type: 'time' as const,
    time: {
      unit: 'minute' as const,
      displayFormats: {
        hour: 'H:mm' as const,
      },
    },
  };
};

export const getStepSize = (minMs: number, maxMs: number) => {
  const days = (maxMs - minMs) / MS_PER_DAY;
  if (days > 365) return 21; // step is 21d
  if (days > 180) return 14; // step is 14d
  if (days > 30) return 7; // step is 7d
  if (days > 21) return 5; // step is 5d
  if (days > 10) return 2; // step is 2d
  if (days > 2) return 1; // step is 1d

  const hours = (maxMs - minMs) / MS_PER_HOUR;
  if (hours > 12) return 6; // step is 6h
  if (hours > 3) return 1; // step is 1h

  return 15; // step is 15m
};
