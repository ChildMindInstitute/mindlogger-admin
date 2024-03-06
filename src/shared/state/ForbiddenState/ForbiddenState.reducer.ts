import { ForbiddenStateSchema } from './ForbiddenState.schema';

export const reducers = {
  addForbiddenError: (state: ForbiddenStateSchema): void => {
    state.data.hasForbiddenError = true;
  },
  clearForbiddenError: (state: ForbiddenStateSchema): void => {
    state.data.hasForbiddenError = false;
  },
};
