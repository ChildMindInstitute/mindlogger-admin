import { Item } from 'redux/modules';
import { performanceTaskResponseTypes } from 'shared/consts';

export const checkIfPerformanceTask = (items: Item[]) =>
  items?.some(({ responseType }) => performanceTaskResponseTypes.includes(responseType));
