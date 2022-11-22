import { base } from 'redux/modules/Base';

import { UsersSchema } from './Users.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: UsersSchema = {
  manager: initialStateData,
  reviewer: initialStateData,
  editor: initialStateData,
  user: initialStateData,
  coordinator: initialStateData,
};
