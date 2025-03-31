import { initialStateData } from 'shared/state';

import { UsersSchema } from './Users.schema';

export const state: UsersSchema = {
  respondentDetails: initialStateData,
  subjectDetails: initialStateData,
};
