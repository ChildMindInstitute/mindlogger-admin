import { pluck } from 'shared/utils';

import { DEFAULT_OPTION_VALUE } from './OptionalItemsAndSettings.const';

export const getOptionValue = (options: unknown[]) =>
  options?.length ? Math.max(...pluck(options, 'value')) + 1 : DEFAULT_OPTION_VALUE;
