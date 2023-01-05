import { createSlice } from '@reduxjs/toolkit';

import * as thunk from './Applet.thunk';

const slice = createSlice({
  name: 'applet',
  initialState: {},
  reducers: {},
});

export const applet = {
  thunk,
  slice,
};
