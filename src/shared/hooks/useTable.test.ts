import { renderHook, act } from '@testing-library/react';

import { useTable } from './useTable';

jest.mock('redux/modules', () => ({
  workspaces: {
    useData: () => ({ ownerId: 'mockOwnerId' }),
  },
}));

describe('useTable hook tests', () => {
  const mockAsyncFn = vi.fn();

  test('should return initial searchValue, order and page', () => {
    const { result } = renderHook(() => useTable(mockAsyncFn));

    expect(result.current.searchValue).toBe('');
    expect(result.current.order).toBe('desc');
    expect(result.current.orderBy).toBe('');
    expect(result.current.page).toBe(1);
  });

  test('should reload', () => {
    const { result } = renderHook(() => useTable(mockAsyncFn));
    act(() => {
      result.current.handleReload();
    });

    expect(mockAsyncFn).toBeCalled();
    expect(mockAsyncFn).toBeCalledTimes(1);
  });

  test('should search', () => {
    const { result } = renderHook(() => useTable(mockAsyncFn));
    act(() => {
      result.current.handleSearch('mockSearch');
    });

    expect(mockAsyncFn).toBeCalled();
    expect(mockAsyncFn).toBeCalledTimes(1);
    expect(result.current.searchValue).toBe('mockSearch');
  });

  test('should change page', () => {
    const { result } = renderHook(() => useTable(mockAsyncFn));
    act(() => {
      result.current.handleChangePage({}, 2);
    });

    expect(mockAsyncFn).toBeCalled();
    expect(mockAsyncFn).toBeCalledTimes(1);
    expect(result.current.page).toBe(3);
  });

  test('should sort', () => {
    const { result } = renderHook(() => useTable(mockAsyncFn));
    act(() => {
      result.current.handleRequestSort({} as React.MouseEvent<unknown>, 'name');
    });

    expect(mockAsyncFn).toBeCalled();
    expect(mockAsyncFn).toBeCalledTimes(1);
    expect(result.current.orderBy).toBe('name');
    expect(result.current.order).toBe('asc');
  });
});
