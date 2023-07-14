import { AppletsSchema } from './Applets.schema';
import { state as initialState } from './Applets.state';

export const resetEventsData = (state: AppletsSchema) => {
  state.events = initialState.events;
};
