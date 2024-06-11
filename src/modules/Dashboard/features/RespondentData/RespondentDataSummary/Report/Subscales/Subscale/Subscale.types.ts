import { Version } from 'api';

import { Subscale } from '../Subscales.types';

export type SubscaleProps = {
  isNested?: boolean;
  name: string;
  subscale: Subscale;
  versions: Version[];
  isActivityCompletionSelected?: boolean;
  flowResponsesIndex?: number;
  'data-testid'?: string;
};
