import { v4 as uuidv4 } from 'uuid';

export const getEmptyCondition = () => ({
  key: uuidv4(),
  type: '',
  itemName: '',
  payload: {
    optionValue: '',
  },
});

export const getObserverSelector = (index: number) => `item-flow-${index}`;
