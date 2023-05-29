import { v4 as uuidv4 } from 'uuid';

import { CalculationType } from 'shared/state';

import { getScoreId } from './ScoreContent/ScoreContent.utils';

export const getScoreDefaults = () => ({
  name: '',
  id: getScoreId('', CalculationType.Sum),
  calculationType: CalculationType.Sum,
  showMessage: false,
  printItems: false,
  itemsScore: [],
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
