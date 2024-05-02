import { ForbiddenStateSchema } from './ForbiddenState.schema';

export const reducers = {
  addForbiddenError: (state: ForbiddenStateSchema): void => {
    state.data.hasForbiddenError = true;
  },
  clearForbiddenError: (state: ForbiddenStateSchema): void => {
    state.data.hasForbiddenError = false;
  },
  setNavigatedFromBuilder: (state: ForbiddenStateSchema): void => {
    state.data.navigatedFromBuilder = true;
  },
  resetNavigatedFromBuilder: (state: ForbiddenStateSchema): void => {
    state.data.navigatedFromBuilder = false;
  },
};
