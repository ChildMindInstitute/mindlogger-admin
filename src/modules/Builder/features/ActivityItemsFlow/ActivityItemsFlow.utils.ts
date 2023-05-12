import { getEmptyCondition } from './ItemFlow/ItemFlow.utils';

export const getEmptyFlowItem = () => ({
  match: '',
  itemKey: '',
  conditions: [getEmptyCondition()],
});
