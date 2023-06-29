import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { state as initialState } from './Users.state';
import { UsersSchema } from './Users.schema';
import {
  getWorkspaceRespondents,
  getAllWorkspaceRespondents,
  getWorkspaceManagers,
} from './Users.thunk';
import {
  createUsersPendingData,
  createUsersRejectedData,
  createUsersFulfilledData,
} from './Users.utils';

export const reducers = {
  resetRespondentsData: (state: UsersSchema): void => {
    state.respondents = initialState.respondents;
  },
  resetManagersData: (state: UsersSchema): void => {
    state.managers = initialState.managers;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<UsersSchema>): void => {
  createUsersPendingData({ builder, thunk: getWorkspaceRespondents, key: 'respondents' });
  createUsersFulfilledData({ builder, thunk: getWorkspaceRespondents, key: 'respondents' });
  createUsersRejectedData({ builder, thunk: getWorkspaceRespondents, key: 'respondents' });

  createUsersPendingData({ builder, thunk: getAllWorkspaceRespondents, key: 'allRespondents' });
  createUsersFulfilledData({ builder, thunk: getAllWorkspaceRespondents, key: 'allRespondents' });
  createUsersRejectedData({ builder, thunk: getAllWorkspaceRespondents, key: 'allRespondents' });

  createUsersPendingData({ builder, thunk: getWorkspaceManagers, key: 'managers' });
  createUsersFulfilledData({ builder, thunk: getWorkspaceManagers, key: 'managers' });
  createUsersRejectedData({ builder, thunk: getWorkspaceManagers, key: 'managers' });
};
