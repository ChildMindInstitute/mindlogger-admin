import { base } from 'shared/state/Base';

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
  folders: initialStateData,
  foldersApplets: initialStateData,
  flattenFoldersApplets: initialStateData,
  appletsSearchTerms: initialSearchTermsStateData,
};
