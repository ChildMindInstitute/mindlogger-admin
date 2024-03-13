import { PayloadAction } from '@reduxjs/toolkit';

import { PopupsPayload, PopupsSchema } from './Popups.schema';
import { state as initialState } from './Popups.state';

export const reducers = {
  setPopupVisible: (state: PopupsSchema, action: PayloadAction<PopupsPayload>): void => {
    state.data.applet = action.payload.applet;
    state.data[action.payload.key] = action.payload.value;
    state.data.popupProps = action.payload.popupProps;
  },
  resetPopupsVisibility: (state: PopupsSchema): void => {
    state.data = initialState.data;
  },
};
