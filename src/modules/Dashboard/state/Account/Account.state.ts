import { base } from 'shared/state/Base';

import { AccountSchema } from './Account.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: AccountSchema = {
  switchAccount: initialStateData,
};
