import { v4 as uuidv4 } from 'uuid';

import { CalculationType } from 'shared/consts';

import { getScoreId } from './ScoreContent/ScoreContent.utils';

export const getScoreDefaults = () => ({
  name: '',
  id: getScoreId('', CalculationType.Sum),
  calculationType: CalculationType.Sum,
  minScore: 0,
  maxScore: 0,
  itemsScore: [],
  showMessage: false,
  printItems: false,
  message: '',
  itemsPrint: [],
});

export const getSectionDefaults = () => ({
  name: '',
  id: uuidv4(),
  showMessage: false,
  printItems: false,
  message: '',
  itemsPrint: [],
});
