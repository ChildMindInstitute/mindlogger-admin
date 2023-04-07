import { ItemResponseType } from 'shared/consts';

import { UNSUPPORTED_ITEMS } from './consts';

export const isItemUnsupported = (type: ItemResponseType) => UNSUPPORTED_ITEMS.includes(type);

export const getItemLabel = (type: ItemResponseType) => `${type}ItemTask`;
