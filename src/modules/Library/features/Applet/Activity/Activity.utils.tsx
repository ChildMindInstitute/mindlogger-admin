import { Item } from 'redux/modules';
import { ItemResponseType } from 'shared/consts';

const perfTaskResponseTypes = [
  ItemResponseType.Flanker,
  ItemResponseType.StabilityTracker,
  ItemResponseType.TouchPractice,
  ItemResponseType.TouchTest,
  ItemResponseType.ABTrails,
];

export const checkIfPerformanceTask = (items: Item[]) =>
  items?.some(({ responseType }) => perfTaskResponseTypes.includes(responseType));
