import { pluck } from 'shared/utils';

export const getOptionValue = (options: unknown[]) =>
  Math.max(...(pluck(options, 'value') || 0)) + 1;
