import { ChartData } from '../../Charts/BarChart/BarChart.types';

export type ScoresProps = {
  reviewDate?: number;
  finalSubscaleScore?: number;
  frequency?: number;
  optionText?: string;
  subscaleScores: ChartData[];
  showAllSubscaleResultsVisible: boolean;
};
