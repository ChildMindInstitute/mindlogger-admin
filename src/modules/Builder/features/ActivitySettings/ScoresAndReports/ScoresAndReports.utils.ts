import { v4 as uuidv4 } from 'uuid';

import { CalculationType } from './ScoreContent/ScoreContent.types';
import { generateScoreId } from './ScoreContent/ScoreContent.utils';

export const getScoreDefaults = () => ({
  name: '',
  id: generateScoreId('', CalculationType.Sum),
  calculationType: CalculationType.Sum,
  showMessage: false,
  printItems: false,
  message: '',
  itemsPrint: [],
  minScore: 0,
  maxScore: 0,
});

export const getSectionDefaults = () => ({
  name: '',
  id: uuidv4(),
  showMessage: false,
  printItems: false,
  message: '',
  itemsPrint: [],
});
