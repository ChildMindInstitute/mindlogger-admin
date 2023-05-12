import { v4 as uuidv4 } from 'uuid';

import { getEmptyCondition } from './ItemFlow/ItemFlow.utils';

export const getEmptyFlowItem = () => ({
  key: uuidv4(),
  match: '',
  itemKey: '',
  conditions: [getEmptyCondition()],
});
