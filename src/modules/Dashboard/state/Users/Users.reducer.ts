import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { UsersSchema } from './Users.schema';
import { getManagersList, getUsersList } from './Users.thunk';
import {
  createUsersFulfilledData,
  createUsersPendingData,
  createUsersRejectedData,
} from './Users.utils';

export const extraReducers = (builder: ActionReducerMapBuilder<UsersSchema>): void => {
  createUsersPendingData(builder, getManagersList, 'manager');
  createUsersFulfilledData(builder, getManagersList, 'manager');
  createUsersRejectedData(builder, getManagersList, 'manager');

  createUsersPendingData(builder, getUsersList, 'user');
  createUsersFulfilledData(builder, getUsersList, 'user');
  createUsersRejectedData(builder, getUsersList, 'user');
};
