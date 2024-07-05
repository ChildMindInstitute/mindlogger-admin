import { Version } from 'api';

import { Completion } from '../Report.types';

export type CompletedChartProps = {
  completions: Completion[];
  versions: Version[];
  isFlow: boolean;
  'data-testid'?: string;
};
