import { base } from 'redux/modules/Base';

import { FoldersSchema } from './Folders.schema';

const initialStateData = {
  ...base.state,
  data: [],
};

const initialSearchTermsStateData = {
  ...base.state,
  data: null,
};

export const state: FoldersSchema = {
  foldersApplets: initialStateData,
  flattenFoldersApplets: initialStateData,
  appletsSearchTerms: initialSearchTermsStateData,
};
