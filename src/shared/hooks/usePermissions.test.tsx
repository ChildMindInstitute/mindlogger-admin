import { renderHook, waitFor } from '@testing-library/react';

import { mockI18Next } from 'shared/tests';
import { ApiResponseCodes } from 'api';
import { Workspace, workspaces } from 'shared/state';
import { mockedOwnerId } from 'shared/mock';
import * as utils from 'shared/utils/errors';

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

  test('should get error message for rejected asyncFn', async () => {
    jest.spyOn(workspaces, 'useData').mockReturnValue({ ownerId: mockedOwnerId } as Workspace);
    const getErrorMessageSpy = jest.spyOn(utils, 'getErrorMessage');
    mockAsyncFunc.mockRejectedValue({});
    const { result } = renderHook(() => usePermissions(mockAsyncFunc));

    await waitFor(() => {
      expect(mockAsyncFunc).toBeCalled();
      expect(getErrorMessageSpy).toBeCalled();
      expect(result.current.isForbidden).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
