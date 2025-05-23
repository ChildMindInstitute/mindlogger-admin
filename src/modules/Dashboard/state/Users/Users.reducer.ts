import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { getPendingData, getFulfilledData, getRejectedData } from 'shared/utils/state';

import { state as initialState } from './Users.state';
import { UsersSchema } from './Users.schema';
import { getRespondentDetails, getSubjectDetails } from './Users.thunk';

export const extraReducers = (builder: ActionReducerMapBuilder<UsersSchema>): void => {
  getPendingData({ builder, thunk: getRespondentDetails, key: 'respondentDetails' });
  getFulfilledData({
    builder,
    thunk: getRespondentDetails,
    key: 'respondentDetails',
    initialState,
  });
  getRejectedData({
    builder,
    thunk: getRespondentDetails,
    key: 'respondentDetails',
    initialState,
  });

  getPendingData({ builder, thunk: getSubjectDetails, key: 'subjectDetails' });
  getFulfilledData({
    builder,
    thunk: getSubjectDetails,
    key: 'subjectDetails',
    initialState,
  });
  getRejectedData({
    builder,
    thunk: getSubjectDetails,
    key: 'subjectDetails',
    initialState,
  });
};
