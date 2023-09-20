import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import { AppStore, RootState } from './store';

export type AppDispatch = AppStore['dispatch'];

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
