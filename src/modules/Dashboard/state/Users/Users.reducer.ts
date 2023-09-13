import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { getPendingData, getFulfilledData, getRejectedData } from 'shared/utils';

import { state as initialState } from './Users.state';
import { UsersSchema } from './Users.schema';
import { getAllWorkspaceRespondents } from './Users.thunk';

export const extraReducers = (builder: ActionReducerMapBuilder<UsersSchema>): void => {
  getPendingData({ builder, thunk: getAllWorkspaceRespondents, key: 'allRespondents' });
  getFulfilledData({
    builder,
    thunk: getAllWorkspaceRespondents,
    key: 'allRespondents',
    initialState,
  });
  getRejectedData({
    builder,
    thunk: getAllWorkspaceRespondents,
    key: 'allRespondents',
    initialState,
  });
};
