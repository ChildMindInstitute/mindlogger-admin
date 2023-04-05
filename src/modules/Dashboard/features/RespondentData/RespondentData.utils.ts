import { ItemInputTypes } from 'shared/types';

import { UNSUPPORTED_ITEMS } from './consts';

export const isItemUnsupported = (type: ItemInputTypes) => UNSUPPORTED_ITEMS.includes(type);

export const getItemLabel = (type: ItemInputTypes) => `${type}ItemTask`;
