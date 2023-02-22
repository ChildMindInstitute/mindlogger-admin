import { base } from 'redux/modules/Base';

import { LibrarySchema } from './Library.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: LibrarySchema = {
  publishedApplets: initialStateData,
};
