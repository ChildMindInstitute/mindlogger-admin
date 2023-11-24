import { v4 as uuidv4 } from 'uuid';

import { Condition } from 'shared/state';

export const getEmptyCondition = (): Condition => ({
  key: uuidv4(),
  type: '',
  itemName: '',
  payload: {
    optionValue: '',
  },
});

export const getObserverSelector = (index: number) => `item-flow-${index}`;
