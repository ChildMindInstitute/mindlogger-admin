import { base } from 'redux/modules/Base';

import { FoldersSchema } from './Folders.schema';

const initialStateData = {
  ...base.state,
  data: [],
};

export const state: FoldersSchema = {
  foldersApplets: initialStateData,
  flattenFoldersApplets: initialStateData,
};
