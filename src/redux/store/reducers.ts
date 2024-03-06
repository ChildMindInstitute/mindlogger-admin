import { combineReducers } from '@reduxjs/toolkit';

import { alerts } from 'shared/state/Alerts';
import { applet } from 'shared/state/Applet';
import { applets } from 'modules/Dashboard/state/Applets';
import { banners } from 'shared/state/Banners';
import { calendarEvents } from 'modules/Dashboard/state/CalendarEvents';
import { popups } from 'modules/Dashboard/state/Popups';
import { users } from 'modules/Dashboard/state/Users';
import { library } from 'modules/Library/state';
import { themes } from 'modules/Builder/state/Themes';
import { reportConfig } from 'modules/Builder/state/ReportConfig';
import { auth } from 'modules/Auth/state';
import { workspaces } from 'shared/state/Workspaces';
import { forbiddenState } from 'shared/state/ForbiddenState';

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
  forbiddenState: forbiddenState.slice.reducer,
});
