import { ItemFormValues } from 'modules/Builder/types';

export type GetConditionsToRemoveConfig = {
  sourceIndex: number;
  destinationIndex: number;
  item: ItemFormValues;
};

export type ItemNameWIthIndex = { index: number; name: string };
