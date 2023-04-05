import { base } from 'shared/state/Base';

import { UsersSchema } from './Users.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: UsersSchema = {
  respondents: initialStateData,
  managers: initialStateData,
};
