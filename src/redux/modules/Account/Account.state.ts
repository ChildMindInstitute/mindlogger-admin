import { base } from 'redux/modules/Base';

import { AccountSchema } from './Account.schema';

export const state: AccountSchema = {
  switchAccount: {
    ...base.state,
    data: null,
  },
};
