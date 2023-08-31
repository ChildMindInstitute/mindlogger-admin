import { ItemFormValues } from 'modules/Builder/types';

export type GetConditionsToRemoveConfig = {
  sourceIndex: number;
  destinationIndex: number;
  item: ItemFormValues;
};

export type ItemNameWithIndex = { index: number; name: string };
