import { Version } from 'api';

import { SubscaleChartData } from '../../Charts/LineChart';

export type AllScoresProps = {
  latestFinalScore: number | null;
  frequency: number;
  data: SubscaleChartData;
  versions: Version[];
  'data-testid'?: string;
};
