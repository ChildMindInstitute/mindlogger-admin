import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { createFulfilledData, createPendingData, createRejectedData } from 'redux/store/utils';

import { UsersSchema } from './Users.schema';
import { getManagersList, getUsersList } from './Users.thunk';

export const extraReducers = (builder: ActionReducerMapBuilder<UsersSchema>): void => {
  createPendingData(builder, getManagersList, 'manager');
  createFulfilledData(builder, getManagersList, 'manager');
  createRejectedData(builder, getManagersList, 'manager');

  createPendingData(builder, getUsersList, 'user');
  createFulfilledData(builder, getUsersList, 'user');
  createRejectedData(builder, getUsersList, 'user');
};
