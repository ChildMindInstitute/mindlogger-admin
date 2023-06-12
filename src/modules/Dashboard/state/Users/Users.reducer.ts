import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

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
