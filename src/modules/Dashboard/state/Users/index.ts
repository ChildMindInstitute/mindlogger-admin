import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import * as thunk from './Users.thunk';
import { state as initialState } from './Users.state';
import { extraReducers } from './Users.reducer';
import { UsersSchema } from './Users.schema';

export * from './Users.schema';

const slice = createSlice({
  name: 'users',
  initialState,
  extraReducers,
  reducers: {},
});

export const users = {
  thunk,
  slice,
  actions: slice.actions,
  useAllRespondentsData: (): UsersSchema['allRespondents']['data'] =>
    useAppSelector(
      ({
        users: {
          allRespondents: { data },
        },
      }) => data,
    ),
  useAllRespondentsStatus: (): UsersSchema['allRespondents']['status'] =>
    useAppSelector(
      ({
        users: {
          allRespondents: { status },
        },
      }) => status,
    ),
  useRespondent: (): UsersSchema['respondentDetails']['data'] | undefined =>
    useAppSelector(
      ({
        users: {
          respondentDetails: { data },
        },
      }) => data,
    ),
  useRespondentStatus: (): UsersSchema['respondentDetails']['status'] =>
    useAppSelector(
      ({
        users: {
          respondentDetails: { status },
        },
      }) => status,
    ),
  useSubject: (): UsersSchema['subjectDetails']['data'] | undefined =>
    useAppSelector(
      ({
        users: {
          subjectDetails: { data },
        },
      }) => data,
    ),
  useSubjectStatus: (): UsersSchema['subjectDetails']['status'] =>
    useAppSelector(
      ({
        users: {
          subjectDetails: { status },
        },
      }) => status,
    ),
};
