import { renderHook, waitFor } from '@testing-library/react';

import { mockI18Next } from 'shared/tests';
import { ApiResponseCodes } from 'api';
import { Workspace, workspaces } from 'shared/state';
import { mockedOwnerId } from 'shared/mock';

import { usePermissions } from './usePermissions';

jest.mock('react-i18next', () => mockI18Next);

describe('usePermissions hook tests', () => {
  const mockAsyncFunc = jest.fn();

  test('should not call asyncFn without owner', async () => {
    jest.spyOn(workspaces, 'useData').mockReturnValue({} as Workspace);
    const { result } = renderHook(() => usePermissions(mockAsyncFunc));

    await waitFor(() => {
      expect(mockAsyncFunc).not.toBeCalled();
      expect(result.current.isForbidden).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('should re-call asyncFn when dependencies change', async () => {
    jest.spyOn(workspaces, 'useData').mockReturnValue({ ownerId: mockedOwnerId } as Workspace);
    let testDeps = [0];
    const { rerender } = renderHook(() => usePermissions(mockAsyncFunc, testDeps));

    rerender();

    await waitFor(() => {
      expect(mockAsyncFunc).toBeCalledTimes(1);
    });

    testDeps = [1];
    rerender();

    await waitFor(() => {
      expect(mockAsyncFunc).toBeCalledTimes(2);
    });
  });

  test('should not be forbidden for successful response', async () => {
    jest.spyOn(workspaces, 'useData').mockReturnValue({ ownerId: mockedOwnerId } as Workspace);
    mockAsyncFunc.mockResolvedValue({
      payload: {
        response: {
          status: ApiResponseCodes.SuccessfulResponse,
          data: null,
        },
      },
    });
    const { result } = renderHook(() => usePermissions(mockAsyncFunc));

    await waitFor(() => {
      expect(mockAsyncFunc).toBeCalled();
      expect(result.current.isForbidden).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.noPermissionsComponent).toBeTruthy();
    });
  });

  test('should be forbidden for forbidden response', async () => {
    jest.spyOn(workspaces, 'useData').mockReturnValue({ ownerId: mockedOwnerId } as Workspace);
    mockAsyncFunc.mockResolvedValue({
      payload: {
        response: {
          status: ApiResponseCodes.Forbidden,
          data: null,
        },
      },
    });
    const { result } = renderHook(() => usePermissions(mockAsyncFunc));

    await waitFor(() => {
      expect(mockAsyncFunc).toBeCalled();
      expect(result.current.isForbidden).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
