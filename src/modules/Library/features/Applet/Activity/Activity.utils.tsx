import { PublishedItem } from 'redux/modules';
import { ItemResponseType } from 'shared/consts';

const perfTaskResponseTypes = [
  ItemResponseType.Flanker,
  ItemResponseType.StabilityTracker,
  ItemResponseType.TouchPractice,
  ItemResponseType.TouchTest,
  ItemResponseType.ABTrails,
];

export const checkIfPerformanceTask = (items: PublishedItem[]) =>
  items?.some(({ responseType }) => perfTaskResponseTypes.includes(responseType));
