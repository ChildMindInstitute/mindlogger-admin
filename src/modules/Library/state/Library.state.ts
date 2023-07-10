import { base } from 'shared/state/Base';

import { LibrarySchema } from './Library.schema';

const initialStateData = {
  ...base.state,
  data: {
    result: [],
    count: 0,
  },
};

export const state: LibrarySchema = {
  publishedApplets: initialStateData,
};
