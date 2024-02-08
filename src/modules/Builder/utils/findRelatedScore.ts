import { ScoreReport } from 'shared/state';
import { getEntityKey } from 'shared/utils';

type FindRelatedScore = {
  entityKey: string;
  scores?: ScoreReport[];
  isSaving?: boolean;
};

export const findRelatedScore = ({ entityKey, scores, isSaving = false }: FindRelatedScore) => {
  if (!scores) return;

  const relatedScore = scores.find(score => getEntityKey(score, !isSaving) === entityKey);

  if (relatedScore) return relatedScore;

  const relatedScoreConditional = scores?.flatMap(score => score.conditionalLogic);

  return relatedScoreConditional?.find(
    conditional => conditional && getEntityKey(conditional, !isSaving) === entityKey,
  );
};
