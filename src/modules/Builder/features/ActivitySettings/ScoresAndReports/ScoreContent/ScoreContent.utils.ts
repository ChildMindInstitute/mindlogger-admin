import { scoreIdBase } from './ScoreContent.const';
import { CalculationType } from './ScoreContent.types';

export const generateScoreId = (name: string, calculationType: CalculationType) =>
  `${scoreIdBase[calculationType]}_${name}`;

export const generateScoreRange = () => '-';
