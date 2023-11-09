import { state } from './Base.state';

export * from './Base.schema';

export const initialStateData = {
  ...state,
  data: null,
};
