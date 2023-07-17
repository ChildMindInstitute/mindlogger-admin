import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { getPendingData, getFulfilledData, getRejectedData } from 'shared/utils';

import { state as initialState } from './Users.state';
import { UsersSchema } from './Users.schema';
import {
  getWorkspaceRespondents,
  getAllWorkspaceRespondents,
  getWorkspaceManagers,
} from './Users.thunk';

export const reducers = {
  resetRespondentsData: (state: UsersSchema): void => {
    state.respondents = initialState.respondents;
  },
  resetManagersData: (state: UsersSchema): void => {
    state.managers = initialState.managers;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<UsersSchema>): void => {
  getPendingData({ builder, thunk: getWorkspaceRespondents, key: 'respondents' });
  getFulfilledData({ builder, thunk: getWorkspaceRespondents, key: 'respondents', initialState });
  getRejectedData({ builder, thunk: getWorkspaceRespondents, key: 'respondents', initialState });

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

  getPendingData({ builder, thunk: getWorkspaceManagers, key: 'managers' });
  getFulfilledData({ builder, thunk: getWorkspaceManagers, key: 'managers', initialState });
  getRejectedData({ builder, thunk: getWorkspaceManagers, key: 'managers', initialState });
};
