import { initialStateData } from 'shared/state';

import { UsersSchema } from './Users.schema';

export const state: UsersSchema = {
  allRespondents: initialStateData,
  respondentDetails: initialStateData,
};
