import { PreloadedState, configureStore } from '@reduxjs/toolkit';
import { RenderOptions } from '@testing-library/react';

import { rootReducer } from './reducers';

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['calendarEvents/createCalendarEvents'],
          ignoredPaths: [
            /^calendarEvents\.(events\.data|processedEvents\.data\.eventsToShow)\.\d+\.start$/,
            /^calendarEvents\.(events\.data|processedEvents\.data\.eventsToShow)\.\d+\.eventStart$/,
            /^calendarEvents\.(events\.data|processedEvents\.data\.eventsToShow)\.\d+\.eventEnd$/,
            /^calendarEvents\.(events\.data|processedEvents\.data\.eventsToShow)\.\d+\.end$/,
          ],
        },
      }),
    preloadedState,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type ExtendedRenderOptions = Omit<RenderOptions, 'queries'> & {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
  route?: string;
  routePath?: string;
};
