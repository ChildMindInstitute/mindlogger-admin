import { AxiosResponse } from 'axios';
import { renderHook, act } from '@testing-library/react';

import { useAsync } from './useAsync';

// Mock async function for testing
const mockAsyncFunction = jest.fn(
  () => Promise.resolve({ data: 'mock data' }) as Promise<AxiosResponse<unknown>>,
);

// Mock callback functions
const mockCallback = jest.fn();
const mockErrorCallback = jest.fn();
const mockFinallyCallback = jest.fn();

describe('useAsync', () => {
  test('should execute async function and update state on success', async () => {
    const { result /*, waitForNextUpdate*/ } = renderHook(() =>
      useAsync(mockAsyncFunction, mockCallback),
    );

    act(() => {
      result.current.execute({
        /* your arguments here */
      });
    });

    // await waitForNextUpdate();

    expect(result.current.value).toEqual({ data: 'mock data' });
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(mockCallback).toHaveBeenCalledWith({ data: 'mock data' });
  });

  test('should handle errors and update state accordingly', async () => {
    const errorResponse = { response: { data: 'error data' } };
    mockAsyncFunction.mockRejectedValueOnce(errorResponse);
    // mockAsyncFunction.mockRejectedValueOnce({ response: { data: 'error data' } } as AxiosError);

    const { result /*, waitForNextUpdate*/ } = renderHook(() =>
      useAsync(mockAsyncFunction, undefined, mockErrorCallback),
    );

    act(() => {
      result.current.execute({
        /* your arguments here */
      });
    });

    // await waitForNextUpdate();

    expect(result.current.value).toBeNull();
    expect(result.current.error).toEqual(errorResponse);
    expect(result.current.isLoading).toBe(false);
    expect(mockErrorCallback).toHaveBeenCalledWith(errorResponse);
  });

  test('should call finally callback regardless of success or failure', async () => {
    const { result /*, waitForNextUpdate*/ } = renderHook(() =>
      useAsync(mockAsyncFunction, undefined, undefined, mockFinallyCallback),
    );

    act(() => {
      result.current.execute({
        /* your arguments here */
      });
    });

    // await waitForNextUpdate();

    expect(mockFinallyCallback).toHaveBeenCalled();
  });

  // Add more test cases for different scenarios, including handling dependencies
});
