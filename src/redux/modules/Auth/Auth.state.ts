import { base } from 'redux/modules/Base';

import { AuthSchema } from './Auth.schema';

export const state: AuthSchema = {
  authentication: {
    ...base.state,
    data: null,
  },
};
