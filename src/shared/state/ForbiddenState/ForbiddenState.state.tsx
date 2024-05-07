import { ForbiddenStateSchema } from './ForbiddenState.schema';

export const state: ForbiddenStateSchema = {
  data: {
    hasForbiddenError: false,
    redirectedFromBuilder: false,
  },
};
