import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import { RootState, store } from './store';

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
