import { ForbiddenStateSchema } from './ForbiddenState.schema';

export const reducers = {
  addForbiddenError: (state: ForbiddenStateSchema): void => {
    state.data.hasForbiddenError = true;
  },
  clearForbiddenError: (state: ForbiddenStateSchema): void => {
    state.data.hasForbiddenError = false;
  },
  setRedirectedFromBuilder: (state: ForbiddenStateSchema): void => {
    state.data.redirectedFromBuilder = true;
  },
  resetRedirectedFromBuilder: (state: ForbiddenStateSchema): void => {
    state.data.redirectedFromBuilder = false;
  },
};
