import { AxiosResponse } from 'axios';
import { renderHook, act } from '@testing-library/react';

import { useAsync } from './useAsync';

const mockedData = { data: 'mock data' };
const errorResponse = { response: { data: 'error data' } };
const mockAsyncFunction = () => Promise.resolve(mockedData) as Promise<AxiosResponse<unknown>>;
const mockAsyncFunctionReject = () => Promise.reject(errorResponse) as Promise<AxiosResponse<unknown>>;

const mockCallback = jest.fn();
const mockErrorCallback = jest.fn();
const mockFinallyCallback = jest.fn();

describe('useAsync', () => {
  test('should execute async function and update state on success', async () => {
    const { result } = renderHook(() => useAsync(mockAsyncFunction, mockCallback));

    await act(async () => {
      await result.current.execute({});
    });

    const updatedResult = result.current;

    expect(updatedResult.value).toEqual(mockedData);
    expect(updatedResult.error).toBeNull();
    expect(updatedResult.isLoading).toBe(false);
    expect(mockCallback).toHaveBeenCalledWith(mockedData);
  });

  test('should handle errors and update state accordingly', async () => {
    const { result } = renderHook(() => useAsync(mockAsyncFunctionReject, undefined, mockErrorCallback));

    await act(async () => {
      try {
        await result.current.execute({});
      } catch (error) {
        //handle the error case, because function inside of catch throws an error
      }
    });

    const updatedResult = result.current;

    expect(updatedResult.value).toBeNull();
    expect(updatedResult.error).toEqual(errorResponse);
    expect(updatedResult.isLoading).toBe(false);
    expect(mockErrorCallback).toHaveBeenCalledWith(errorResponse);
  });

  test('should call finally callback regardless of success or failure', async () => {
    const { result } = renderHook(() => useAsync(mockAsyncFunction, undefined, undefined, mockFinallyCallback));

    await act(async () => {
      await result.current.execute({});
    });

    const updatedResult = result.current;

    expect(updatedResult.isLoading).toBe(false);
    expect(mockFinallyCallback).toHaveBeenCalled();
  });
});
