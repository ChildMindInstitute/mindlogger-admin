import { ScoreReport } from 'shared/state';
import { getEntityKey } from 'shared/utils';

export const getDefaultScoreCondition = (score: ScoreReport) => ({
  itemName: getEntityKey(score, false),
  type: '',
});
