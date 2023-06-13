export const getScoreConditionId = (scoreId: string, scoreConditionName = '') =>
  `${scoreId}_${scoreConditionName.toLowerCase()}`;
