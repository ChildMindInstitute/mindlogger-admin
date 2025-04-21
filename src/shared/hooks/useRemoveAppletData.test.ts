import { act, renderHook } from '@testing-library/react';

import { LocalStorageKeys, storage } from 'shared/utils';

import { useRemoveAppletData } from './useRemoveAppletData';

jest.mock('redux/store', () => ({
  useAppDispatch: vi.fn,
}));

describe('useRemoveAppletData hook tests', () => {
  test('should remove keys from storage', () => {
    const spyStorage = vi.spyOn(storage, 'removeItem');
    const { result } = renderHook(() => useRemoveAppletData());
    act(() => {
      result.current();
    });

    expect(spyStorage).nthCalledWith(1, LocalStorageKeys.IsFromLibrary);
    expect(spyStorage).nthCalledWith(2, LocalStorageKeys.LibraryPreparedData);
  });
});
