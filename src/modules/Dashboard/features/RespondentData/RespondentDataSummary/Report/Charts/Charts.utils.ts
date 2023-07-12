import { MAX_LABEL_CHARS_Y, MS_PER_DAY, MS_PER_HOUR } from './Charts.const';

export const truncateString = (label: string) =>
  label?.length > MAX_LABEL_CHARS_Y ? `${label.substring(0, MAX_LABEL_CHARS_Y)}...` : label;

export const getTimeConfig = (minMs: number, maxMs: number) => {
  const msDiff = maxMs - minMs;
  const days = msDiff / MS_PER_DAY;

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

  const hours = msDiff / MS_PER_HOUR;
  const unit = hours > 3 ? ('hour' as const) : ('minute' as const);

  return {
    type: 'time' as const,
    time: {
      unit,
      displayFormats: {
        hour: 'MMM d, H:mm' as const,
      },
    },
  };
};

export const getStepSize = (minMs: number, maxMs: number) => {
  const msDiff = maxMs - minMs;
  const days = msDiff / MS_PER_DAY;
  if (days > 365) return 21; // step is 21d
  if (days > 180) return 14;
  if (days > 30) return 7;
  if (days > 21) return 5;
  if (days > 10) return 2;
  if (days > 2) return 1;

  const hours = msDiff / MS_PER_HOUR;
  if (hours > 12) return 6; // step is 6h
  if (hours > 3) return 1;

  return 15; // step is 15m
};
