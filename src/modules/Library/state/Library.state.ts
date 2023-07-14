import { base } from 'shared/state/Base';

import { LibrarySchema } from './Library.schema';

const initialStateData = {
  ...base.state,
  data: {
    result: [],
    count: 0,
  },
};

const cartStateData = {
  ...base.state,
  data: {
    result: {
      cartItems: [],
    },
  },
};

export const state: LibrarySchema = {
  publishedApplets: initialStateData,
  cartApplets: cartStateData,
  isCartBtnDisabled: {
    ...base.state,
    data: false,
  },
};
