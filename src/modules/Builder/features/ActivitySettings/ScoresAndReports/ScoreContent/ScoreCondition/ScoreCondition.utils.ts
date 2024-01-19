import { ForbiddenScoreIdSymbols } from '../ScoreContent.const';

export const getScoreConditionId = (scoreId: string, scoreConditionName = '') =>
  `${scoreId}_${scoreConditionName.toLowerCase().replaceAll(ForbiddenScoreIdSymbols, '_')}`;
