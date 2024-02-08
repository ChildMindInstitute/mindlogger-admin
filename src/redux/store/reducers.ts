import { combineReducers } from '@reduxjs/toolkit';

import { auth } from 'modules/Auth/state';
import { reportConfig } from 'modules/Builder/state/ReportConfig';
import { themes } from 'modules/Builder/state/Themes';
import { applets } from 'modules/Dashboard/state/Applets';
import { calendarEvents } from 'modules/Dashboard/state/CalendarEvents';
import { popups } from 'modules/Dashboard/state/Popups';
import { users } from 'modules/Dashboard/state/Users';
import { library } from 'modules/Library/state';
import { alerts } from 'shared/state/Alerts';
import { applet } from 'shared/state/Applet';
import { banners } from 'shared/state/Banners';
import { workspaces } from 'shared/state/Workspaces';

export const rootReducer = combineReducers({
  alerts: alerts.slice.reducer,
  applet: applet.slice.reducer,
  applets: applets.slice.reducer,
  auth: auth?.slice.reducer,
  banners: banners.slice.reducer,
  calendarEvents: calendarEvents.slice.reducer,
  library: library.slice.reducer,
  popups: popups.slice.reducer,
  reportConfig: reportConfig.slice.reducer,
  themes: themes.slice.reducer,
  users: users.slice.reducer,
  workspaces: workspaces.slice.reducer,
});
