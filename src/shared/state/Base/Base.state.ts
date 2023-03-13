import { BaseSchema } from './Base.schema';

export const state: BaseSchema = {
  requestId: '',
  status: 'idle',
  error: undefined,
  data: null,
};
