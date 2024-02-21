// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { act, renderHook } from '@testing-library/react';

import * as reduxHooks from 'redux/store/hooks';
import { library } from 'redux/modules';
import { STORAGE_SELECTED_KEY } from 'modules/Library/consts';

import { useClearCart } from './Cart.hooks';

const mockSessionStorageSelectedKey = 'mockSessionStorageSelectedKey';
const mockDispatch = () => Promise.resolve('');

jest.mock('redux/store/hooks', () => ({
  useAppDispatch: jest.fn(),
}));

describe('useClearCart', () => {
  beforeEach(() => {
    sessionStorage.setItem(STORAGE_SELECTED_KEY, mockSessionStorageSelectedKey);

    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  test('removes item from sessionStorage and dispatches thunk', () => {
    const spyPostAppletsToCarts = jest.spyOn(library.thunk, 'postAppletsToCart');
    expect(sessionStorage.getItem(STORAGE_SELECTED_KEY)).toEqual(mockSessionStorageSelectedKey);

    const { result } = renderHook(useClearCart);

    act(result.current);

    expect(spyPostAppletsToCarts).toHaveBeenCalledWith([]);
    expect(sessionStorage.getItem(STORAGE_SELECTED_KEY)).toEqual(null);
  });
});
