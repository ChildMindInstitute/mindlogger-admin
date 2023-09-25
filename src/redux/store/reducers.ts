import { combineReducers } from '@reduxjs/toolkit';

import {
  alerts,
  applet,
  applets,
  auth,
  calendarEvents,
  library,
  popups,
  reportConfig,
  themes,
  users,
  workspaces,
} from 'redux/modules';

export const rootReducer = combineReducers({
  alerts: alerts.slice.reducer,
  applet: applet.slice.reducer,
  applets: applets.slice.reducer,
  auth: auth.slice.reducer,
  calendarEvents: calendarEvents.slice.reducer,
  library: library.slice.reducer,
  popups: popups.slice.reducer,
  reportConfig: reportConfig.slice.reducer,
  themes: themes.slice.reducer,
  users: users.slice.reducer,
  workspaces: workspaces.slice.reducer,
});
