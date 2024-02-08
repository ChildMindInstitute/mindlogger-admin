import { initialStateData } from 'shared/state';

import { LibrarySchema } from './Library.schema';

export const state: LibrarySchema = {
  publishedApplets: {
    ...initialStateData,
    data: {
      result: [],
      count: 0,
    },
  },
  cartApplets: {
    ...initialStateData,
    data: {
      result: [],
      count: 0,
    },
  },
  isAddToBuilderBtnDisabled: {
    ...initialStateData,
    data: false,
  },
};
