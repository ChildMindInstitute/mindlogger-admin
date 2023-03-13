import { base } from 'shared/state/Base';

import { AppletsSchema } from './Applets.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: AppletsSchema = {
  applets: initialStateData,
};
