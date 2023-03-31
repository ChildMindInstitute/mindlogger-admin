import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { Manager, Respondent, UsersSchema } from './Users.schema';
import { getWorkspaceUsers } from './Users.thunk';
import { createUsersPendingData, createUsersRejectedData } from './Users.utils';
import { state as initialState } from './Users.state';

export const extraReducers = (builder: ActionReducerMapBuilder<UsersSchema>): void => {
  createUsersPendingData({ builder, thunk: getWorkspaceUsers, key: 'respondents' });

  builder.addCase(getWorkspaceUsers.fulfilled, (state, action) => {
    if (
      state.respondents.status === 'loading' &&
      state.respondents.requestId === action.meta.requestId
    ) {
      state.respondents.requestId = initialState.respondents.requestId;
      state.respondents.status = 'success';
      const respondents = action.payload.data.result.filter((item: Respondent) =>
        item.roles.includes('respondent'),
      );
      const managers = action.payload.data.result.filter((item: Manager) =>
        item.roles.includes('manager'),
      );
      state.respondents.data = {
        count: respondents?.length,
        result: respondents,
      };
      state.managers.data = {
        count: managers?.length,
        result: managers,
      };
    }
  });

  createUsersRejectedData({ builder, thunk: getWorkspaceUsers, key: 'respondents' });
};
