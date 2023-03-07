import { base } from 'shared/state/Base';

import { AuthSchema } from './Auth.schema';

export const state: AuthSchema = {
  authentication: {
    ...base.state,
    data: null,
  },
  isAuthorized: false,
};
