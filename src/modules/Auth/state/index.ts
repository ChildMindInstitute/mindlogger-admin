import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import * as thunk from './Auth.thunk';
import { state as initialState } from './Auth.state';
import { reducers, extraReducers } from './Auth.reducer';
import { AuthSchema } from './Auth.schema';

export * from './Auth.schema';

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers,
  extraReducers,
});

export const auth = {
  thunk,
  slice,
  actions: slice.actions,
  useStatus: (): AuthSchema['authentication']['status'] =>
    useAppSelector(
      ({
        auth: {
          authentication: { status },
        },
      }) => status,
    ),
  useAuthorized: (): AuthSchema['isAuthorized'] =>
    useAppSelector(({ auth: { isAuthorized } }) => isAuthorized),
  useData: (): AuthSchema['authentication']['data'] =>
    useAppSelector(
      ({
        auth: {
          authentication: { data },
        },
      }) => data,
    ),
  useUserInitials: (): string =>
    useAppSelector(
      ({
        auth: {
          authentication: { data },
        },
      }) =>
        data
          ? `${data.user.firstName.substring(0, 1)}${data.user.lastName.substring(
              0,
              1,
            )}`.toUpperCase()
          : '',
    ),
  useLogoutInProgress: (): AuthSchema['isLogoutInProgress'] =>
    useAppSelector(({ auth: { isLogoutInProgress } }) => isLogoutInProgress),
};
